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
    data: {
        rows: {
            id: string;
            name: string;
            category: string;
            status: string;
            code: string;
            available: string;
            minimum: string;
            measurementName: string;
            measurementValue: number;
            measurementUnit: string;
            batchNumber: string;
            manufacturerName: string;
            imageUrl: string;
            createdAt: string
            updatedAt: string
        }[];
        totalPage: number;
        currentPage: number;
    };
}

type ResponseCategory = {
    statusCode: number;
    error: string;
    message: string;
    data: {
        rows: {
            id: string;
            name: string;
            items: number;
            createdBy: string;
            createdAt: string;
        }[];
        totalPage: number;
        currentPage: number;
    };
}

describe("Items", async function () {

    let categoryId: string;

    describe("Get category", async function () {

        let result: ResponseCategory;

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

        it("list category", async function () {
            const res = await request.get("/v1/category")
                .set('User-Agent', userAgent)
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /json/)
            result = res.body as ResponseCategory;
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

        it("data is an object", async function () {
            assert.strictEqual(typeof result.data, "object", "data should be an object");
            expect(result.data).to.not.be.empty;
        });

        it("data has all properties", async function () {
            const expectedProperties = ["rows", "totalPages", "currentPage"];
            const responseBodyKeys = Object.keys(result.data);
            expectedProperties.forEach((property) => {
                assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
                expect(property).to.not.be.empty;
            });
        });

        it("row is an array", async function () {
            expect(result.data.rows).to.be.an("array")
            assert(result.data.rows.length >= 1);
            categoryId = result.data.rows[0].id;
        });

        it("rows has all properties", async function () {
            const expectedProperties = ["id", "name", "items", "createdBy", "createdAt"];
            result.data.rows.forEach((obj: any) => {
                expectedProperties.forEach((prop) => {
                    expect(obj).to.have.property(prop);
                });
            });
        });
    })

    describe("Save", async function () {

        let result: Response;

        it("save item", async function () {
            await request.post("/v1/item")
                .set('User-Agent', userAgent)
                .set("Accept", "application/json")
                .send({
                    name: "new item",
                    category: categoryId,
                    code: "DVC2937",
                    available: "1000",
                    price: "200",
                    minimum: "100",
                    batch: "ADS",
                    measurmentValue: "",
                    measurmentName: "",
                    measurementUnit: "",
                    manufacturerName: ""

                })
                .expect(200)
                .expect("Content-Type", /json/)
        });

        it("list items", async function () {
            const res = await request.get("/v1/item")
                .set('User-Agent', userAgent)
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
            const expectedProperties = ["rows", "totalPages", "currentPage"];
            const responseBodyKeys = Object.keys(result.data);
            expectedProperties.forEach((property) => {
                assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
                expect(property).to.not.be.empty;
            });
        });

        it("data has no extra properties", async function () {
            const expectedProperties = ["rows", "totalPages", "currentPage"];
            const extraProperties = Object.keys(result.data).filter(prop => !expectedProperties.includes(prop));
            expect(extraProperties).to.be.empty;
        });

        it("row is an array", async function () {
            expect(result.data.rows).to.be.an("array")
            assert(result.data.rows.length >= 1);
        });

        it("rows has all properties", async function () {
            const expectedProperties = ["id", "name", "status", "category", "code", "available", "minimum", "measurementName", "measurementValue", "measurementUnit", "batchNumber", "manufacturerName", "imageUrl", "createdAt", "updatedAt"];
            result.data.rows.forEach((obj) => {
                expectedProperties.forEach((prop) => {
                    expect(obj).to.have.property(prop);
                });
            });
        });
    });
});
