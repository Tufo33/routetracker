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

export async function POST(request: Request) {
    const body = await request.json()
    const client = await pool.connect()
    const result = await client.query(
        'INSERT INTO routes (driver_id, status, stops, total_packages) VALUES ($1, $2, $3, $4) RETURNING *',
        [body.driver_id, body.status, body.stops, body.total_packages]
      )
    client.release()
    return NextResponse.json(result.rows[0])
}
