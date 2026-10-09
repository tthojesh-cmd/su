import { Pool } from "pg";
const g = globalThis as any;
const pool: Pool = g.__pool ?? (g.__pool = new Pool({ connectionString: process.env.DATABASE_URL }));
// Always use parameterized queries ($1, $2...) -> protects against SQL injection.
export const query = (text: string, params: unknown[] = []) => pool.query(text, params);
