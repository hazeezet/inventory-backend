"use strict"

import { FastifyPluginAsync, RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import validation from "#services/v1/validator/index.js";
import { EditItem } from "#types/payloads";
import UTILS from "#services/utils/index.js";

/**
 * Request body
 */
interface requestBody extends RequestGenericInterface {
	Body: {
		id: string;
		name: string;
        category: string;
        code: string;
        price: number;
        minimum: number;
        batch: string;
        measurmentValue: number;
        measurementUnit: string;
        measurementName: string;
        manufacturerName: string;
	}
}

const HOOK_PAYLOAD: FastifyPluginAsync = fp(async function (fastify, opts) {

	fastify.addHook<requestBody>("preHandler", async (request, reply) => {

		try {
			const req_id = request.body ? request.body.id : undefined as unknown as string;
			const req_name = request.body ? request.body.name : undefined as unknown as string;
            const req_category = request.body ? request.body.category : undefined as unknown as string;
            const req_code = request.body ? request.body.code : undefined as unknown as string;
            const req_price = request.body ? request.body.price : undefined as unknown as number;
            const req_minimum = request.body ? request.body.minimum : undefined as unknown as number;
            const req_batch= request.body ? request.body.batch : undefined as unknown as string;
            const req_measurementValue = request.body ? request.body.measurmentValue : undefined as unknown as number;
            const req_measurementUnit  = request.body ? request.body.measurementUnit: undefined as unknown as string;
            const req_measurementName  = request.body ? request.body.measurementName: undefined as unknown as string;
            const req_manufacturerName = request.body ? request.body.manufacturerName : undefined as unknown as string;


			const validate = new validation(reply);
           
			const req_payloads: EditItem = {
				Id: req_id ? req_id.trim() : undefined as unknown as string,
				Name: req_name ? req_name.trim() : undefined as unknown as string,
                Category: req_category ? req_category.trim() : undefined as unknown as string,
                Code: req_code ? req_code.trim() : undefined as unknown as string,
                Price: req_price ? parseFloat(req_price.toString().trim()) : undefined as unknown as number,
                Minimum: req_minimum ? parseInt(req_minimum.toString().trim()) : undefined as unknown as number,
                Batch: req_batch ? req_batch.trim() : undefined as unknown as string,
                MeasurementValue: req_measurementValue ? parseFloat(req_measurementValue.toString().trim()) : undefined as unknown as number,
                MeasurementUnit: req_measurementUnit ? req_measurementUnit.trim() : undefined as unknown as string,
                MeasurementName: req_measurementName ? req_measurementName.trim() : undefined as unknown as string,
                ManufacturerName: req_manufacturerName ? req_manufacturerName .trim() : undefined as unknown as string,
                
			}

			const utils = new UTILS(fastify, reply);

			await utils.UserAgentInfo(request.headers["user-agent"] as string);

			const payloads = await validate.editItem(req_payloads);

			request.PAYLOADS = payloads;
		}
		catch (error) {
			request.error = reply.DefaultResponse;
			throw new Error();
		}

	});
})

export default HOOK_PAYLOAD;
