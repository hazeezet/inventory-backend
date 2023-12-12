"use strict"

import fp from "fastify-plugin";
import Redis from "ioredis";
import { Job, Processor, Queue, Worker, WorkerOptions } from "bullmq";
import { EmailVerification } from "#types/email";
import EMAIL_TEMPLATE from "#services/email/index.js";

type SendMail = {
    /**template of the mail to send */
    template: "verification" | "branch_admin_verification" | "reset_password" | "welcome" | "delete_item";
    /**email subject */
    subject: string;
    /**email of the user */
    email: string;
    /**reply email */
    replyTo?: string;
    /**data used to pharse the html template */
    data: EmailVerification | null
}

export default fp(async function (fastify, _opts) {

    const connection = new Redis({
        connectionName: process.env.REDIS_CONNECTION_NAME ?? "inventory",
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT as unknown as number,
        password: process.env.REDIS_PASSWORD,
        connectTimeout: 500,
        db: process.env.REDIS_DB_INDEX as unknown as number ?? 0,
        maxRetriesPerRequest: null
    })

    const sendMailQueue = new Queue("sendMailQueue", { connection });

    async function sendMail(job: Job<SendMail, void, string>): Promise<void | Processor<SendMail, any, string> | undefined> {

        const mailTemplate = new EMAIL_TEMPLATE(fastify);

        const data = job.data.data as EmailVerification;

        const template = mailTemplate[job.data.template](data);

        if (template === null) return;

        const firstName = data.name.split(" ")[0];
        const email = job.data.email;

        fastify.mailer.sendMail(
            {
                to: `${firstName} <${email}>`,
                subject: job.data.subject,
                replyTo: job.data.replyTo,
                html: template
            },

            (errors, info) => {
                if (errors) {
                    fastify.logger.error(errors);
                    fastify.debug.debug(errors);
                }
            })
    }

    const startWorker = (workerOptions: WorkerOptions) => {

        const sendmail = new Worker<SendMail, any>("sendMailQueue", sendMail, workerOptions);

        sendmail.on('failed', (job: Job<SendMail, void, string> | undefined, error: Error) => {
            fastify.logger.error(error);
            fastify.debug.debug(error);
        });

        sendmail.on('error', (error: any) => {
            fastify.logger.error(error);
            fastify.debug.debug(error);
        });

    }

    const workerOptions: WorkerOptions = {
        connection,
        concurrency: 5,
        removeOnComplete: { age: 120, count: 50 },
        removeOnFail: { age: 600, count: 50 },
        limiter: {
            max: 10,
            duration: 2000
        }
    };

    startWorker(workerOptions)

    fastify.decorate("SEND_MAIL_QUEUE", sendMailQueue);

    fastify.decorate("SEND_MAIL", async (data: SendMail): Promise<void> => {
        fastify.SEND_MAIL_QUEUE.add("sendMailQueue", data);
    })

})

declare module "fastify" {
    export interface FastifyInstance {
        /**sending queue (private use) */
        SEND_MAIL_QUEUE: Queue<any, any, string>;
        /**send mail */
        SEND_MAIL: (data: SendMail) => Promise<void>
    }
}
