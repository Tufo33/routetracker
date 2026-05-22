import { Pool } from 'pg'
import { NextResponse } from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const client = await pool.connect()
    const offset = ( page - 1) * 10
    const result = await client.query(
        `SELECT routes.id, drivers.name, drivers.email, routes.status, routes.stops, routes.total_packages FROM routes JOIN drivers ON routes.driver_id = drivers.id LIMIT 10 OFFSET ${offset}`
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

export async function DELETE(request: Request) {
    const body = await request.json()
    const { id } = body
    const client = await pool.connect()
    const result = await client.query(
        'DELETE FROM routes WHERE id = $1', 
        [id]
    )    
    client.release()
    return NextResponse.json({ message: 'Route gelöscht'})
}

export async function PUT(request: Request) {
    const body = await request.json()
    const { id } = body
    const client = await pool.connect()
    const result = await client.query(
        'UPDATE routes SET status = $1, stops = $2, total_packages = $3 WHERE id = $4',
        [body.status, body.stops, body.total_packages, body.id]
    )
    client.release()
    return NextResponse.json(result.rows)
}