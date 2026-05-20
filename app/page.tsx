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

  function getStatusStyle(status: string) {
    if (status === 'unterwegs') return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'
    if (status === 'geplant') return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm'
    return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
  }
 
  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">RouteTracker</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Fahrer</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Stops</th>
            <th className="p-3 text-left">Pakete</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id} className="border-b hover:bg-gray-50 hover:text-black">
              <td className="p-3">{route.id}</td>
              <td className="p-3">{route.name}</td>
              <td className="p-3">{route.email}</td>
              <td className="p-3">
                <span className={getStatusStyle(route.status)} >{route.status}</span></td>
              <td className="p-3">{route.stops}</td>
              <td className="p-3">{route.total_packages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}