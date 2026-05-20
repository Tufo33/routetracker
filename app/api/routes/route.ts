import { Pool } from 'pg'
import { NextResponse } from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export async function GET() {
    const client = await pool.connect()
    const result = await client.query(
        'SELECT routes.id, drivers.name, drivers.email, routes.status, routes.stops, routes.total_packages FROM routes JOIN drivers ON routes.driver_id = drivers.id'
    )
    client.release()
    return NextResponse.json(result.rows)
}
