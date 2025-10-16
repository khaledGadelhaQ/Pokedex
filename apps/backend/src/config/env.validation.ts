export function validateEnv(config: Record<string, unknown>) {
  const requiredEnvVars = ['DATABASE_URL'];

  for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return config;
}
