import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

function getKey(keyStr?: string): Buffer {
  const envKey = keyStr || process.env.ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error('Encryption key must be provided or set in ENCRYPTION_KEY env var');
  }
  // Ensure key is 32 bytes
  return crypto.scryptSync(envKey, 'salt', 32);
}

export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function encrypt(text: string, keyStr?: string): string {
  try {
    const key = getKey(keyStr);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error('Encryption failed');
  }
}

export function decrypt(encryptedText: string, keyStr?: string): string {
  try {
    const key = getKey(keyStr);
    const parts = encryptedText.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted text format');
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
}
