import Fastify from "fastify";
//@ts-ignore
import apps from "../dist/app";
import dotenv from "dotenv";
import { exit } from "process";

const fastify = Fastify()
const port = 5000

export const mochaGlobalSetup = async () => {
    dotenv.config({
        path: "./.env.test"
    });

    fastify.register(apps);
    fastify.listen({ port }, (err) => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
    });
    await fastify.ready()
    console.log(`server is ready`);
};

export const mochaGlobalTeardown = async () => {
    await fastify.close();
    console.log("server is closed")
    exit()
};

export const host = "http://localhost:5000";
export const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";
