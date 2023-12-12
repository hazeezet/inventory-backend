import fp from "fastify-plugin";
import { Transporter } from "nodemailer";


export default fp(async function (fastify, _opts) {
	fastify.register(require("fastify-mailer"), {
		defaults: {
			from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDERESS}>`,
		},
		transport: {
			host: `${process.env.EMAIL_HOST}`,
			port: 465,
			secure: true, // use TLS
			auth: {
				user: `${process.env.EMAIL_USER}`,
				pass: `${process.env.EMAIL_PASSWORD}`
			}
		}
	})
})


export type FastifyMailer = Transporter;

declare module "fastify" {
	interface FastifyInstance {
		mailer: FastifyMailer;
	}
}
