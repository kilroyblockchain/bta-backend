import * as crypto from 'crypto';

/**
 * Hash string using sha256 hashing algorithm
 *
 * @param {string} args - String to hashed string
 * @return {Promise<string>} - Returns Promise of hashed hex string
 *
 *
 */
export async function sha256Hash(args: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.write(args); // write a single line to the buffer
    return hash.digest('hex'); // returns hash as string
}

/**
 * Generate UniqueId of 16 bytes converted into Hex
 *
 * @return {string} - Returns Unique 16 bytes string
 *
 */
export const generateUniqueId = () => {
    return crypto.randomBytes(16).toString('hex');
};
