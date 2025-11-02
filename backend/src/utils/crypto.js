import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts text using AES-256-GCM
 * @param text - Plain text to encrypt
 * @param key - 32-byte encryption key (from FINWISE_KMS_KEY env)
 * @returns Encrypted string in format: iv:tag:encrypted
 */
export function encrypt(text, key) {
  const keyBuffer = Buffer.from(key, 'utf8').subarray(0, 32); // Ensure 32 bytes
  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  
  const cipher = crypto.createCipher(ALGORITHM, keyBuffer);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts text using AES-256-GCM
 * @param encryptedData - Encrypted string in format: iv:encrypted
 * @param key - 32-byte encryption key (from FINWISE_KMS_KEY env)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData, key) {
  const keyBuffer = Buffer.from(key, 'utf8').subarray(0, 32); // Ensure 32 bytes
  const parts = encryptedData.split(':');
  
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipher(ALGORITHM, keyBuffer);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generates a secure random 32-byte key for encryption
 * @returns Base64 encoded 32-byte key
 */
export function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('base64');
}

/**
 * Hash password using bcrypt (for user authentication)
 * @param password - Plain text password
 * @returns Promise<string> Hashed password
 */
export async function hashPassword(password) {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 12);
}

/**
 * Compare password with hash
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns Promise<boolean> True if password matches
 */
export async function comparePassword(password, hash) {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hash);
}