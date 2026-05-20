"use client"

import { useState, useEffect } from "react";

interface Route {
  id: number
  driver_id: number
  status: string
  distance_km: number
}

export default function Home() {

  const [routes, setRoutes] = useState<Route[]>([])
  useEffect(() => {
    async function fetchRoutes() {
      const res = await fetch("/api/routes")
      const data = await res.json()
      setRoutes(data)
    }
    fetchRoutes()
  }, [])
 
  return(
    <div>
      <h1>RouteTracker</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fahrer</th>
            <th>Status</th>
            <th>Distanz</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.driver_id}</td>
              <td>{route.status}</td>
              <td>{route.distance_km}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}