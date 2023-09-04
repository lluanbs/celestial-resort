/**
 * @fileoverview This module provides utility functions for hashing and comparing hashed values.
 */

import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

/**
 * @typedef ScryptAsyncFunction
 * @type {function}
 * @property {string | Buffer} password - The password to hash.
 * @property {string | Buffer} salt - The salt to use for hashing.
 * @property {number} keylen - The length of the key to generate.
 * @returns {Promise<Buffer>} A promise that resolves with the hashed password.
 */
type ScryptAsyncFunction = (password: string | Buffer, salt: string | Buffer, keylen: number) => Promise<Buffer>;

const scryptAsync: ScryptAsyncFunction = promisify(scrypt);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

/**
 * Hashes a value using the scrypt algorithm.
 *
 * @param {string} value - The value to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed value.
 *
 * @example
 * // get a hashed value
 * const hashedValue = await hash("myPassword");
 */
async function hash(value: string) {
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const derivedKey = await scryptAsync(value, salt, KEY_LENGTH);
    return `${salt}:${derivedKey.toString('hex')}`;
};

/**
 * Compares a value with a stored hash using the scrypt algorithm.
 *
 * @param {string} value - The value to compare.
 * @param {string} storedHash - The stored hash to compare against.
 * @returns {Promise<boolean>} A promise that resolves with true if the value matches the stored hash; false otherwise.
 *
 * @example
 * // compare a value with a stored hash
 * const isMatch = await compare("myPassword", storedHash);
 */
async function compare(value: string, storedHash: string) {
    const [salt, hash] = storedHash.split(':');
    const derivedKey = await scryptAsync(value, salt, KEY_LENGTH);
    return derivedKey.toString('hex') === hash;
};

export { hash, compare };