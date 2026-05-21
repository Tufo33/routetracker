import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export async function GET () {
    const client = await pool.connect()
    const result = await client.query(
        'SELECT id, name from drivers'
    )
    client.release()
    return NextResponse.json(result.rows)
}