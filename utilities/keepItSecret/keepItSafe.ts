import crypto from 'crypto';

/**
 * The purpose of this file is to make a quick encryption of data so that it
 * becomes more difficult for some bad actor to do stuff.
 *
 * @param key Optional* key for the salt
 */
export class DataEncryptor {
   private algorithm: string;
   private key: Buffer;
   private iv: Buffer;

   constructor(key: string = '') {
      this.algorithm = 'aes-256-cbc';
      this.key = crypto.createHash('sha256').update(key).digest().subarray(0, 32);
      this.iv = crypto.randomBytes(16);
   }

   /**
    * Encrypts your data
    * @param data String or object
    * @returns Encrypted string
    */
   public encryptData(data: string | object): string {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${this.iv.toString('hex')}:${encrypted}`;
   }

   /**
    * Decrypts your data
    * @param encryptedData Encrypted string
    * @returns Decrypted string or object
    */
   public decryptData(encryptedData: string): any {
      const [ivHex, encryptedHex] = encryptedData.split(':');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(ivHex, 'hex'));
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
   }
}
