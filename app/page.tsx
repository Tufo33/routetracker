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
  const [formData, setFormData] = useState({
    driver_id: '',
    status: '',
    stops: '',
    total_packages: ''
  })
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)

  async function fetchRoutes() {
    const res = await fetch("/api/routes")
    const data = await res.json()
    setRoutes(data)
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  function getStatusStyle(status: string) {
    if (status === 'unterwegs') return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'
    if (status === 'geplant') return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm'
    return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
  }

  async function handleSubmit() {
    await fetch('/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    fetchRoutes()
    setFormData({
      driver_id: '',
      status: '',
      stops: '',
      total_packages: ''
    })
  }

  async function handleDelete(id: number) {
    await fetch('/api/routes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchRoutes()
  }
  
  function handleEdit(route: Route) {
    setEditingRoute(route)
  }

  async function handleUpdate() {
    await fetch('/api/routes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(editingRoute)
    })
    fetchRoutes()
    setEditingRoute(null)
  }

  return(
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">RouteTracker</h1>
      {editingRoute && (
        <div className="mb-6 p-4 border rounded bg-yellow-50">
          <h2 className="text-xl font-bold mb-4">Route bearbeiten</h2>
            <input 
              type="text"
              className="border p-2 mr-2"
              value={editingRoute.status}
              onChange={(e) => setEditingRoute({...editingRoute, status: e.target.value})}
            />  
            <input 
              type="number"
              className="border p-2 mr-2"
              value={String(editingRoute.stops)}
              onChange={(e) => setEditingRoute({...editingRoute, stops:Number(e.target.value)})}
            />  
            <input 
              type="number"
              className="border p-2 mr-2"
              value={String(editingRoute.total_packages)}
              onChange={(e) => setEditingRoute({...editingRoute, total_packages:Number(e.target.value)})}
            />  
            <button onClick={handleUpdate} className="bg-green-600 text-white p-2 rounded">
              Speichern
            </button>
        </div>
      )}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Neue Route</h2>
        <input
          type="number"
          placeholder="Fahrer ID"
          className="border p-2 mr-2"
          value={formData.driver_id}
          onChange={(e) => setFormData({...formData, driver_id: e.target.value})}  
        />
        <input
          type="text"
          placeholder="Status"
          className="border p-2 mr-2"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}  
        />
        <input
          type="number"
          placeholder="stops"
          className="border p-2 mr-2"
          value={formData.stops}
          onChange={(e) => setFormData({...formData, stops: e.target.value})}  
        />
        <input
          type="number"
          placeholder="total_packages"
          className="border p-2 mr-2"
          value={formData.total_packages}
          onChange={(e) => setFormData({...formData, total_packages: e.target.value})}  
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
          Speichern
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Fahrer</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Stops</th>
            <th className="p-3 text-left">Pakete</th>
            <th className="p-3 text-left">Aktion</th>
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
              <td className="p-3">
                <button 
                  onClick={() => handleEdit(route)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Bearbeiten
                </button>
                <button 
                  onClick={() => handleDelete(route.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded">
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}