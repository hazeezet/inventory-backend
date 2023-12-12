"use strict"

// Require the framework
import Fastify from "fastify";

// Register your application as a normal plugin.
import appService from "./app";

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace, { CloseWithGraceAsyncCallback } from "close-with-grace";

interface log {
    transport: {
        target: string,
    }
}

let log: boolean | log = false;

if (process.env.NODE_ENV != "production") {
    log = {
        transport: {
            target: "pino-pretty",
        }
    }
}

// Instantiate Fastify with some config
const app = Fastify({
    logger: log
})


app.register(appService);

// delay is the number of milliseconds for the graceful close to finish
const closeListenersCallback: CloseWithGraceAsyncCallback = async ({ err }) => {
    if (err) {
        app.log.error(err)
    }
    await app.close()
};

const closeListeners = closeWithGrace(
    { delay: 500 },
    closeListenersCallback
);

app.addHook("onClose", (instance, done) => {
    closeListeners.uninstall()
    done()
})


const port: any = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
    // Start listening.
    app.listen({ port, host: "0.0.0.0" }, (err) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    });
}

else{
    // Start listening.
    app.listen({ port }, (err) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    });
}
