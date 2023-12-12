import supertest from "supertest";
import assert from "assert";
//@ts-ignore
import { host, userAgent } from "#test/helper.ts";

const request = supertest.agent(host);

type ResponseList = {
    statusCode: number;
    error: string;
    message: string;
    data: {
        rows: {
            id: string;
            name: string;
            currency: string | null;
        }[];
        totalPage: number;
        currentPage: number;
    };
}

type Response = {
    statusCode: number;
    error: string;
    message: string;
    data: {};
}

describe("Business", async function () {

    describe("Edit", async function () {

        let result: Response;
        let businessId: string;

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

        it("list business", async function () {
            const res = await request.get("/v1/business")
                .set('User-Agent', userAgent)
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /json/)
            const result = res.body as ResponseList;
            businessId = result.data.rows[0].id
        });

        it("edit business", async function () {
            const res = await request.patch("/v1/business")
                .set('User-Agent', userAgent)
                .set("Accept", "application/json")
                .send({
                    id: businessId,
                    name: "edited business",
                    currency: "NGN"
                })
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

        it("data is an object and is empty", async function () {
            assert.deepStrictEqual(result.data, {}, `data should be an empty object`)
        });
    });
});
