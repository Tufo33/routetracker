"use client"

import { useState, useEffect } from "react";

interface Route {
  id: number
  name: string
  email: string
  status: string
  stops: number
  total_packages: number
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
            <th>Email</th>
            <th>Status</th>
            <th>Stops</th>
            <th>Pakete</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.name}</td>
              <td>{route.email}</td>
              <td>{route.status}</td>
              <td>{route.stops}</td>
              <td>{route.total_packages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}