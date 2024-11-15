import { createClient } from 'redis';

/**
 * Configuration options for Redis storage
 * @interface StorageConfig
 * @property {string} [host] - Redis server host
 * @property {number} [port] - Redis server port
 * @property {string} [password] - Redis server password
 * @property {string} [url] - Redis connection URL
 */
type StorageConfig = {
  host?: string;
  port?: number;
  password?: string;
  url?: string;
};

/**
 * Generic type for stored values
 * @interface StorageValue
 */
export type StorageValue = {
  [key: string]: any;
};

/** Redis client type */
type RedisClient = ReturnType<typeof createClient>;

/** Global Redis client reference */
const globalForRedis = global as unknown as {
  redis: RedisClient | null;
};

/**
 * Validates required Redis configuration
 * @param {StorageConfig} config - Redis configuration
 * @throws {Error} If required configuration is missing
 */
function validateConfig(config: StorageConfig): void {
  const required = ['host', 'port', 'password'] as const;
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`);
  }
}

/**
 * Creates a new Redis connection
 * @param {StorageConfig} config - Redis configuration
 * @returns {Promise<RedisClient>} Connected Redis client
 */
async function createConnection(config: StorageConfig): Promise<RedisClient> {
  validateConfig(config);

  const redis = createClient({
    password: config.password,
    socket: {
      host: config.host,
      port: config.port,
    },
    url: config.url,
  });

  redis.on('error', (err) => console.error('Redis Client Error:', err));
  redis.on('connect', () => console.log('Redis Client Connected'));

  await redis.connect();
  return redis;
}

/**
 * Gets or creates a Redis client
 * @param {StorageConfig} [config] - Optional Redis configuration
 * @returns {Promise<RedisClient>} Redis client instance
 */
export async function getClient(config?: StorageConfig): Promise<RedisClient> {
  if (globalForRedis.redis?.isOpen) {
    return globalForRedis.redis;
  }

  const storageConfig = config ?? {
    host: process.env.STORAGE_HOST,
    port: Number(process.env.STORAGE_PORT),
    password: process.env.STORAGE_PASSWORD,
  };

  globalForRedis.redis = await createConnection(storageConfig);
  return globalForRedis.redis;
}

/**
 * Sets a value in Redis
 * @param {string} key - Key to store value under
 * @param {StorageValue} value - Value to store
 * @param {number} [ttl] - Time to live in seconds
 */
export async function setValue(
  key: string,
  value: StorageValue,
  ttl?: number
): Promise<void> {
  const storage = await getClient();
  const serialized = JSON.stringify(value);

  if (ttl) {
    await storage.setEx(key, ttl, serialized);
  } else {
    await storage.set(key, serialized);
  }
}

/**
 * Gets a value from Redis
 * @template T Type of stored value
 * @param {string} key - Key to retrieve
 * @returns {Promise<T | null>} Retrieved value or null if not found
 */
export async function getValue<T = StorageValue>(
  key: string
): Promise<T | null> {
  const storage = await getClient();
  const value = await storage.get(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Deletes a value from Redis
 * @param {string} key - Key to delete
 * @returns {Promise<boolean>} True if key was deleted
 * @throws {Error} If deletion fails
 */
export async function deleteValue(key: string): Promise<boolean> {
  try {
    const storage = await getClient()
    const result = await storage.del(key)
    return result > 0
  } catch (error) {
    console.error('Error deleting key from Redis:', error)
    throw new Error(`Failed to delete key: ${key}`)
  }
}

/**
 * Checks if a key exists in Redis
 * @param {string} key - Key to check
 * @returns {Promise<boolean>} True if key exists
 */
export async function exists(key: string): Promise<boolean> {
  const storage = await getClient();
  const result = await storage.exists(key);
  return result === 1;
}

/**
 * Gets all keys matching a pattern
 * @param {string} query - Pattern to match keys against
 * @returns {Promise<string[]>} Matching keys
 */
export async function getKeys(query: string) {
  const storage = await getClient();
  return await storage.keys(query);
}

/**
 * Disconnects from Redis
 */
export async function disconnect(): Promise<void> {
  if (globalForRedis.redis) {
    await globalForRedis.redis.quit();
    globalForRedis.redis = null;
  }
}