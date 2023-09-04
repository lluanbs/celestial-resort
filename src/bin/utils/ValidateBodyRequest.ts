/**
 * @fileoverview This module provides a function to validate JSON objects against a JSON schema using Ajv.
 */

import Ajv, { KeywordCxt, _ } from "ajv";

/**
 * Validates a JSON object against a JSON schema.
 *
 * @param {any} jsonSchema - The JSON schema to validate against.
 * @param {any} objectToValidate - The JSON object to validate.
 * @returns {Array | null} An array of error objects if the JSON object fails validation; null otherwise.
 *
 * @example
 * // define a JSON schema
 * const schema = {
 *   name: { type: 'string', isNotEmpty: true },
 *   age: { type: 'number' }
 * };
 *
 * // define a JSON object
 * const object = {
 *   name: '',
 *   age: 30
 * };
 *
 * // validate the JSON object against the schema
 * const errors = validate(schema, object);
 */
export default (jsonSchema: any, objectToValidate: any) => {

    const ajv = new Ajv({
        allErrors: true,
        strict: false,
        strictRequired: true
    });

    const schema = {
        type: "object",
        properties: jsonSchema,
        additionalProperties: false,
    };

    ajv.addKeyword({
        keyword: 'isNotEmpty',
        schemaType: 'boolean',
        type: 'string',
        code(cxt: KeywordCxt) {
            const { data, schema } = cxt;
            if (schema) {
                cxt.fail(_`${data}.trim() === ''`);
            }
        },
        error: {
            message: 'string field must be non-empty'
        }
    });

    const requireAll = (schema: { type?: string; properties: any; additionalProperties?: boolean; }) => {
        return {
            ...schema,
            required: Object.keys(schema.properties)
        }
    };

    const validate = ajv.compile(requireAll(schema));
    validate(objectToValidate);

    if (validate.errors) {
        return validate.errors.map(err => {
            const customErrors = {
                path: err.schemaPath.replace("/isNotEmpty", ""),
                params: err.params,
                message: err.message,
                additionalProperty: err.params.additionalProperty
            };
            return customErrors;
        })
    };
    return validate.errors
};