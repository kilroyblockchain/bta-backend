import { Logger, UnauthorizedException } from '@nestjs/common';
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
export const generateUniqueId = (): string => {
    return crypto.randomBytes(16).toString('hex');
};

export async function encrypt(text): Promise<any> {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), key: key.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export async function decrypt(encryptedData, ivString, keyString): Promise<string> {
    const iv = Buffer.from(ivString, 'hex');
    const key = Buffer.from(keyString, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export async function encryptKey(key: string): Promise<string> {
    const encrypted = await encrypt(key);
    return encrypted.iv + encrypted.key + encrypted.encryptedData;
}

export async function decryptKey(encryptedKey: string): Promise<string> {
    const logger = new Logger('DecryptKey');
    try {
        const iv = encryptedKey.substring(0, 32);
        const key = encryptedKey.substring(32, 96);
        const bcKey = encryptedKey.substring(96);
        const decrypted = await decrypt(bcKey, iv, key);
        return decrypted;
    } catch (err) {
        logger.error(err);
        throw new UnauthorizedException();
    }
}
