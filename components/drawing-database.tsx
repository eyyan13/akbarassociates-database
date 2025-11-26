"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import DataEntryForm from "./data-entry-form"
import JobSearchUpdate from "./job-search-update"
import CsvImport from "./csv-import"
import type { Drawing } from "@/types/drawing"
import drawingsData from "@/data/drawings.json"
import projectsData from "@/data/projects.json"

export default function DrawingDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Drawing>("projectName")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [allDrawings, setAllDrawings] = useState<Drawing[]>(drawingsData as Drawing[])
  const [allProjects, setAllProjects] = useState(projectsData)
  const [activeTab, setActiveTab] = useState<"view" | "entry" | "update" | "import">("view")
  const [filterProject, setFilterProject] = useState<string>("")

  const filteredDrawings = useMemo(() => {
    let filtered = allDrawings

    if (filterProject) {
      filtered = filtered.filter((d) => d.projectName === filterProject)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (drawing) =>
          drawing.projectName.toLowerCase().includes(term) ||
          drawing.jobNumber.toLowerCase().startsWith(term) || // Changed to startsWith for partial matching
          drawing.drawingTitle.toLowerCase().includes(term) ||
          drawing.preparedBy?.toLowerCase().includes(term),
      )
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField] || ""
      const bVal = b[sortField] || ""

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1
    })

    return filtered
  }, [searchTerm, allDrawings, sortField, sortOrder, filterProject])

  const handleAddDrawing = (newDrawing: Drawing) => {
    const updatedDrawings = [newDrawing, ...allDrawings]
    setAllDrawings(updatedDrawings)
    localStorage.setItem("drawingsData", JSON.stringify(updatedDrawings))
    setActiveTab("view")
    alert("Drawing added successfully!")
  }

  const handleUpdateDrawing = (updatedDrawing: Drawing) => {
    const updatedDrawings = allDrawings.map((d) => (d.id === updatedDrawing.id ? updatedDrawing : d))
    setAllDrawings(updatedDrawings)
    localStorage.setItem("drawingsData", JSON.stringify(updatedDrawings))
  }

  const handleCsvImport = (newDrawings: Drawing[]) => {
    const updatedDrawings = [...allDrawings, ...newDrawings]
    setAllDrawings(updatedDrawings)
    localStorage.setItem("drawingsData", JSON.stringify(updatedDrawings))
    setActiveTab("view")
    alert(`${newDrawings.length} drawings imported successfully!`)
  }

  const handleSort = (field: keyof Drawing) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleDeleteDrawing = (id: string) => {
    if (window.confirm("Are you sure you want to delete this drawing? This action cannot be undone.")) {
      const updatedDrawings = allDrawings.filter((d) => d.id !== id)
      setAllDrawings(updatedDrawings)
      localStorage.setItem("drawingsData", JSON.stringify(updatedDrawings))
      alert("Drawing deleted successfully!")
    }
  }

  const handleAddProject = (newProject: { id: string; name: string; soilBearingCapacity: number }) => {
    const updatedProjects = [...allProjects, newProject]
    setAllProjects(updatedProjects)
    localStorage.setItem("projectsData", JSON.stringify(updatedProjects))
    alert("Project added successfully!")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Not Sticky */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">AKBAR & ASSOCIATES DRAWING MANAGEMENT SYSTEM</h1>
            <p className="text-gray-600 mt-2">Consulting Engineers - Professional Drawing Database</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {[
              { id: "view", label: "View Drawings" },
              { id: "entry", label: "Add New Drawing" },
              { id: "update", label: "Search & Update" },
              { id: "import", label: "Import CSV" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* VIEW TAB */}
        {activeTab === "view" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Project (Optional)</label>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Show All Projects</option>
                  {allProjects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {filterProject && (
                  <p className="text-sm text-blue-600 mt-2">
                    Showing drawings for: <span className="font-semibold">{filterProject}</span>
                  </p>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by project, job number (e.g., '922' for partial match), title, or prepared by..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Info */}
            <div className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredDrawings.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{allDrawings.length}</span> drawings
              {filterProject && <span className="ml-2 text-blue-600">(filtered by {filterProject})</span>}
            </div>

            {/* Table */}
            {filteredDrawings.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {[
                        { field: "projectName", label: "Project" },
                        { field: "jobNumber", label: "Job #" },
                        { field: "drawingTitle", label: "Drawing Title" },
                        { field: "drawingType", label: "Type" },
                        { field: "revision", label: "Rev" },
                        { field: "preparedBy", label: "Prepared By" },
                        { field: "date", label: "Date" },
                        { field: "actions", label: "Actions" },
                      ].map((col) => (
                        <th
                          key={col.field}
                          onClick={() => col.field !== "actions" && handleSort(col.field as keyof Drawing)}
                          className={`px-4 py-3 text-left text-gray-700 font-semibold ${
                            col.field !== "actions" ? "cursor-pointer hover:bg-gray-100" : ""
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-2">
                            {col.label}
                            {sortField === col.field && (
                              <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrawings.map((drawing) => (
                      <tr key={drawing.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-medium">{drawing.projectName}</td>
                        <td className="px-4 py-3 text-gray-700 font-mono">{drawing.jobNumber}</td>
                        <td className="px-4 py-3 text-gray-700 line-clamp-2">{drawing.drawingTitle}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              drawing.drawingType === "Manual"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {drawing.drawingType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-mono">{drawing.revision || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{drawing.preparedBy || "-"}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{drawing.date}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteDrawing(drawing.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No drawings found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* ENTRY TAB */}
        {activeTab === "entry" && (
          <div className="max-w-2xl">
            <DataEntryForm onAddDrawing={handleAddDrawing} onAddProject={handleAddProject} allProjects={allProjects} />
          </div>
        )}

        {/* UPDATE TAB */}
        {activeTab === "update" && (
          <div className="max-w-2xl">
            <JobSearchUpdate drawings={allDrawings} onUpdateDrawing={handleUpdateDrawing} />
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === "import" && (
          <div className="max-w-2xl">
            <CsvImport onImport={handleCsvImport} />
          </div>
        )}
      </div>
    </div>
  )
}
