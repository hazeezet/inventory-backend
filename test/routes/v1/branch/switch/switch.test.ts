import supertest from "supertest";
import assert from "assert";
import * as chai from "chai";
//@ts-ignore
import { host, userAgent } from "#test/helper.ts";

const request = supertest.agent(host);
const expect = chai.expect;

type ResponseList = {
    statusCode: number;
    error: string;
    message: string;
    data: {
        rows: {
            id: string;
            name: string;
            address: string | null;
        }[];
        totalPage: number;
        currentPage: number;
    };
}

type ResponseSwitch = {
    statusCode: number;
    error: string;
    message: string;
    data: {};
}

type ResponseAuth = {
    statusCode: number;
    error: string;
    message: string;
    data: {
        businessId: string;
        branchId: string;
        businessName: string;
        branchName: string;
        role: string;
        name: string;
        email: string;
        country: string;
        currency: string;
    };
}

describe("Branch", async function () {

    describe("Switch", async function () {

        let currenctBranchId: string;
        let switchBranchId: string;

        describe("Login", async function () {

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
        })

        describe("Authenticate", async function () {

            let result: ResponseAuth;

            it("authenticate", async function () {
                const res = await request.post("/v1/auth/authenticate")
                    .set("Accept", "application/json")
                    .expect(200)
                    .expect("Content-Type", /json/)
                result = res.body as ResponseAuth;
                currenctBranchId = result.data.branchId;
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

            it("data has all properties", async function () {
                const expectedProperties = ["businessId", "branchId", "businessName", "branchName", "role", "name", "email", "country", "currency"];
                const responseBodyKeys = Object.keys(result.data);
                expectedProperties.forEach((property) => {
                    assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
                    expect(property).to.not.be.empty;
                });
            });
        });

        describe("Get branch", async function () {

            let result: ResponseList;

            it("list branch", async function () {
                const res = await request.get("/v1/branch")
                    .set('User-Agent', userAgent)
                    .set("Accept", "application/json")
                    .expect(200)
                    .expect("Content-Type", /json/)
                result = res.body as ResponseList;
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
                assert(result.data.rows.length >= 2);

                const filteredItem = result.data.rows.find(branch => branch.id !== currenctBranchId);
                switchBranchId = filteredItem ? filteredItem.id : "";
            });

            it("rows has all properties", async function () {
                const expectedProperties = ["id", "name", "address"];
                result.data.rows.forEach((obj: any) => {
                    expectedProperties.forEach((prop) => {
                        expect(obj).to.have.property(prop);
                    });
                });
            });
        })

        describe("Switch branch", async function () {

            let result: ResponseSwitch;

            it("switch", async function () {
                const res = await request.post("/v1/branch/switch")
                    .set("User-Agent", userAgent)
                    .set("Accept", "application/json")
                    .send({
                        id: switchBranchId
                    })
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .expect("set-cookie", /qinv_token=/)
                result = res.body as ResponseSwitch;
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
        })

        describe("Reauthenticate", async function () {

            let result: ResponseAuth;

            it("authenticate", async function () {
                const res = await request.post("/v1/auth/authenticate")
                    .set("Accept", "application/json")
                    .expect(200)
                    .expect("Content-Type", /json/)
                result = res.body as ResponseAuth;
                currenctBranchId = result.data.branchId;
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

            it("data has all properties", async function () {
                const expectedProperties = ["businessId", "branchId", "businessName", "branchName", "role", "name", "email", "country", "currency"];
                const responseBodyKeys = Object.keys(result.data);
                expectedProperties.forEach((property) => {
                    assert.ok(responseBodyKeys.includes(property), `Missing property: ${property}`);
                    expect(property).to.not.be.empty;
                });
            });

            it("switch successful", async function () {
                assert.strictEqual(currenctBranchId, switchBranchId, "Switched branch is not the same")
            });
        });
    });
});
