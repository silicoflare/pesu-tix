// env.ts
export interface ENVType {
  DATABASE_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  MINIO_URL: string;
  MINIO_ACCESS_ID: string;
  MINIO_ACCESS_KEY: string;
}

function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`${name} not declared in .env`);
  }
  return val;
}

const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  NEXTAUTH_URL: getEnv("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getEnv("NEXTAUTH_SECRET"),
  MINIO_URL: getEnv("MINIO_URL"),
  MINIO_ACCESS_ID: getEnv("MINIO_ACCESS_ID"),
  MINIO_ACCESS_KEY: getEnv("MINIO_ACCESS_KEY"),
}

export default env;
