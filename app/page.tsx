"use client"

import { setTimeout } from "node:timers";
import { useState, useEffect } from "react";

interface Route {
  id: number
  name: string
  email: string
  status: string
  stops: number
  total_packages: number
}

interface Driver {
  id: number
  name: string
}

export default function Home() {

  const [routes, setRoutes] = useState<Route[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    driver_id: '',
    status: '',
    stops: '',
    total_packages: ''
  })
  const [filterStatus, setFilterStatus] = useState("")
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [toast, setToast] = useState({
    message: "",
    visible: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRoutes, setTotalRoutes] = useState(0)

  async function fetchRoutes() {
    setLoading(true)
    const res = await fetch(`/api/routes?page=${currentPage}`)
    const data = await res.json()
    setRoutes(data.routes)
    setTotalRoutes(Number(data.total))
    setLoading(false)
  }

  async function fetchDrivers() {
    const res = await fetch("/api/drivers")
    const data = await res.json()
    setDrivers(data)
  }

  useEffect(() => {
    fetchRoutes()
    fetchDrivers()
  }, [currentPage])

  useEffect(() => {
    if (filterStatus === "") {
      setFilteredRoutes(routes)
    } else {
      const gefiltert = routes.filter(route => route.status === filterStatus)
      setFilteredRoutes(gefiltert)
    }
  },[filterStatus, routes])

  function showToast(message: string) {
    setToast({ message, visible: true})
    setTimeout(() => {
      setToast({message: "", visible: false})
    }, 3000);
  }

  function getStatusStyle(status: string) {
    if (status === 'unterwegs') return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm'
    if (status === 'geplant') return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm'
    return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
  }

  async function handleSubmit() {
    if(formData.driver_id === '' || formData.status === '' || formData.stops === '' || formData.total_packages === '' ){
      alert('Bitte alle Felder ausfüllen!')
      return
    }
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
    showToast("Erfolgreich aktualisiert!")
  }

  async function handleDelete(id: number) {
    const bestaetigung = confirm("Möchtest du diese Route wirklich löschen?")
    if (bestaetigung === true) {
      await fetch('/api/routes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchRoutes()
      showToast("Erfolgreich gelöscht!")
    }
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
    showToast("Erfolgreich updated")
  }

  const anzahlUnterwegs = routes.filter(route => route.status === "unterwegs").length
  const anzahlGeplant = routes.filter(route => route.status === "geplant").length
  const anzahlAbgeschlossen = routes.filter(route => route.status === "abgeschlossen").length
  const searchedRoutes = filteredRoutes.filter(route => route.name.toLowerCase().includes(searchTerm.toLowerCase()) )
  const sortedRoutes = [...searchedRoutes].sort((a, b) => {
    if (sortDirection === "asc") {
      return (a[sortField as keyof Route] as number) - (b[sortField as keyof Route] as number)
    } else {
      return (b[sortField as keyof Route] as number) - (a[sortField as keyof Route] as number)
    }
  })
  const totalPages = Math.ceil(totalRoutes / 10)

  return(
    <div className="p-8">
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {toast.message}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">RouteTracker</h1>
      {editingRoute && (
        <div className="mb-6 p-4 border rounded bg-yellow-50">
          <h2 className="text-xl font-bold mb-4 text-black">Route bearbeiten</h2>
            <select
              className="text-black border p-2 mr-2"
              value={editingRoute.status}
              onChange={(e) => setEditingRoute({...editingRoute, status: e.target.value})}
            >
              <option className="text-black" value='unterwegs'>unterwegs</option>
              <option className="text-black" value='geplant'>geplant</option>
              <option className="text-black" value='abgeschlossen'>abgeschlossen</option>
            </select> 
            <input 
              type="number"
              className="border p-2 mr-2 text-black"
              value={String(editingRoute.stops)}
              onChange={(e) => setEditingRoute({...editingRoute, stops:Number(e.target.value)})}
            />  
            <input 
              type="number"
              className="border p-2 mr-2 text-black"
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
        <select 
          className="border p-2 mr-2"
          value={formData.driver_id} 
          onChange={(e) => setFormData({...formData, driver_id: e.target.value})}>
            <option className="text-black" value="">-- Fahrer wählen --</option>
              {drivers.map((driver) => (
                <option className="text-black" key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
        </select>
        <select
          className="border p-2 mr-2"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option className="text-black" value="">-- Status wählen --</option>
            <option className="text-black" value="unterwegs">unterwegs</option>
            <option className="text-black" value="geplant">geplant</option>
            <option className="text-black" value="abgeschlossen">abgeschlossen</option>
        </select>
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
      {loading && <p>Daten werden geladen</p>}
      <div className="mb-4 flex flex-wrap gap-1">
          <input
            className="border p-2 mb-2 rounded w-full md:w-64"
            type="text"
            placeholder="Fahrer suchen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        <button className={filterStatus === "" ? "bg-gray-800 rounded p-3 m-1 min-w-[80px] text-sm" : "bg-gray-600 rounded p-3 m-1 min-w-[80px] text-sm"} onClick={() => setFilterStatus("")}>Alle</button>
        <button className={filterStatus === "unterwegs" ? "bg-green-800 rounded p-3 m-1 min-w-[80px] text-sm" : "bg-green-600 rounded p-3 m-1 min-w-[80px] text-sm"} onClick={() => setFilterStatus("unterwegs")}>Unterwegs</button>
        <button className={filterStatus === "geplant" ? "bg-yellow-800 rounded p-3 m-1 min-w-[80px] text-sm" : "bg-yellow-600 rounded p-3 m-1 min-w-[80px] text-sm"} onClick={() => setFilterStatus('geplant')}>Geplant</button>
        <button className={filterStatus === "abgeschlossen" ? "bg-blue-800 rounded p-3 m-1 min-w-[80px] text-sm" : "bg-blue-600 rounded p-3 m-1 min-w-[80px] text-sm"} onClick={() => setFilterStatus("abgeschlossen")}>Abgeschlossen</button>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="p-4 rounded border bg-green-100 text-black">
          <p>Unterwegs</p>
          <p className="text-2xl font-bold">{anzahlUnterwegs}</p>
        </div>  
          <div className="p-4 rounded border bg-yellow-100 text-black">
            <p>Geplant</p>
            <p className="text-2xl font-bold">{anzahlGeplant}</p>
          </div>
        
          <div className="p-4 rounded border bg-blue-100 text-black">
            <p>Abgeschlossen</p>
            <p className="text-2xl font-bold">{anzahlAbgeschlossen}</p>
          </div>
      </div>
      <div className="overflow-x-auto">        
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left hidden md:table-cell">ID</th>
            <th className="p-3 text-left">Fahrer</th>
            <th className="p-3 text-left hidden md:table-cell">Email</th>
            <th className="p-3 text-left">Status</th>
            <th 
            className="p-3 text-left cursor-pointer hidden md:table-cell" 
            onClick={() => {
              setSortField("stops") 
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")}}>
              Stops
            </th>
            <th 
            className="p-3 text-left cursor-pointer" 
            onClick={() => {
              setSortField("total_packages")
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")}}>Pakete
            </th>
            <th className="p-3 text-left">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {sortedRoutes.map((route) => (
            <tr key={route.id} className="border-b hover:bg-gray-50 hover:text-black">
              <td className="p-3 hidden md:table-cell">{route.id}</td>
              <td className="p-3">{route.name}</td>
              <td className="p-3 hidden md:table-cell">{route.email}</td>
              <td className="p-3">
                <span className={getStatusStyle(route.status)} >{route.status}</span></td>
              <td className="p-3 hidden md:table-cell">{route.stops}</td>
              <td className="p-3">{route.total_packages}</td>
              <td className="p-3">
                <button 
                  onClick={() => handleEdit(route)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 min-w-[100px] text-center">
                  Bearbeiten
                </button>
                <button 
                  onClick={() => handleDelete(route.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded min-w-[100px] text-center">
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button 
        disabled = { currentPage === 1 }
        className={currentPage === 1? "bg-gray-200 p-1 rounded m-1 cursor-not-allowed" : "bg-gray-400 p-1 rounded m-1"} 
        onClick={() => setCurrentPage(currentPage -1)} 
        >Zurück</button>
        <span>Seite {currentPage} von {totalPages}</span>
      <button
        disabled={currentPage === totalPages} 
        className={currentPage === totalPages ? "bg-gray-200 p-1 rounded m-1 cursor-not-allowed" : "bg-gray-400 p-1 rounded m-1"} 
        onClick={() => setCurrentPage(currentPage +1)}
        >Weiter
      </button>
    </div>
  )
}