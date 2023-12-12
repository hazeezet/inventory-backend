import supertest from "supertest";
import assert from "assert";
//@ts-ignore
import { host } from "#test/helper.ts";

const request = supertest(host);

type Response = {
    statusCode: number;
    error: string;
    message: string;
    data: object;
}

describe("Welcome", async function () {

    let result: Response;

    it("server is available", async function () {
        const res = await request.get("/")
            .expect(200)
            .set("Accept", "application/json")
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

    it("welcome message is showing", async function () {
        assert.strictEqual(result.message, "welcome", "response message should be available")
    });

    it("data is an object and is empty", async function () {
        assert.deepStrictEqual(result.data, {}, `data should be an empty object`)
    });
});
