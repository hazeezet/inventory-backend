import supertest from "supertest";
import assert from "assert";
import * as chai from "chai";
//@ts-ignore
import { host, userAgent } from "#test/helper.ts";

const request = supertest.agent(host);
const expect = chai.expect;

type Response = {
    statusCode: number;
    error: string;
    message: string;
    data: object;
}

describe("Authenticate", async function () {

    let result: Response;

    it("login", async function () {
        await request.post("/v1/auth/login")
            .set("User-Agent", userAgent)
            .set("Accept", "application/json")
            .send({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
            .expect(200)
            .expect("Content-Type", /json/)
            .expect("set-cookie", /qinv_token=/)
    });

    it("authenticate", async function () {
        const res = await request.post("/v1/auth/authenticate")
            .set("Accept", "application/json")
            .expect(200)
            .expect("Content-Type", /json/)
        result = res.body as Response;
    });

    it("All properties are available", async function () {
        const expectedProperties = ["statusCode", "error", "message", "data"];
        const responseBodyKeys = Object.keys(result);
        expectedProperties.forEach((property) => {
            assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
        });
    });

    it("status code is ok", async function () {
        assert.strictEqual(result.statusCode, 200, `request failed: ${result.error}`)
    });

    it("error is empty", async function () {
        assert.strictEqual(result.error, "", "error should be empty")
    });

    it("success message", async function () {
        assert.strictEqual(result.message, "success", "response message should be available")
    });

    it("data is an object", async function () {
        assert.strictEqual(typeof result.data, "object", "data should be an object");
        expect(result.data).to.not.be.empty;
    });

    it("data has all properties", async function () {
        const expectedProperties = ["businessId", "branchId", "businessName", "branchName", "role", "name", "email", "country", "currency"];
        const responseBodyKeys = Object.keys(result.data);
        expectedProperties.forEach((property) => {
            assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
            expect(property).to.not.be.empty;
        });
    });

    it("data has no extra properties", async function () {
        const expectedProperties = ["businessId", "branchId", "businessName", "branchName", "role", "name", "email", "country", "currency"];
        const extraProperties = Object.keys(result.data).filter(prop => !expectedProperties.includes(prop));
        expect(extraProperties).to.be.empty;
    });
});
