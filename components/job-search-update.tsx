"use client"

import { useState } from "react"
import type { Drawing } from "@/types/drawing"

interface JobSearchUpdateProps {
  drawings: Drawing[]
  onUpdateDrawing: (updatedDrawing: Drawing) => void
}

export default function JobSearchUpdate({ drawings, onUpdateDrawing }: JobSearchUpdateProps) {
  const [searchJobNumber, setSearchJobNumber] = useState("")
  const [foundDrawing, setFoundDrawing] = useState<Drawing | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<Drawing>>({})

  const handleSearch = () => {
    const found = drawings.find((d) => d.jobNumber.toLowerCase().startsWith(searchJobNumber.toLowerCase()))
    if (found) {
      setFoundDrawing(found)
      setEditData({})
      setEditMode(false)
    } else {
      setFoundDrawing(null)
      alert("Job Number not found. Try searching for the beginning of the number.")
    }
  }

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveUpdate = () => {
    if (foundDrawing) {
      const updatedDrawing: Drawing = {
        ...foundDrawing,
        ...editData,
      }
      onUpdateDrawing(updatedDrawing)
      setFoundDrawing(updatedDrawing)
      setEditMode(false)
      setEditData({})
      alert("Drawing updated successfully!")
    }
  }

  const handleClose = () => {
    setFoundDrawing(null)
    setSearchJobNumber("")
    setEditMode(false)
    setEditData({})
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Search & Update by Job Number</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Enter the job number or the beginning of it (e.g., "922" will find "922-DU-02")
      </p>

      {!foundDrawing ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchJobNumber}
              onChange={(e) => setSearchJobNumber(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter Job Number (e.g., 922-DU-02 or just 922)"
              className="input-field flex-1"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!editMode ? (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Project Name</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.projectName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Job Number</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.jobNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Drawing Title</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.drawingTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Prepared By</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.preparedBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Revision</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.revision}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Drawing Type</p>
                    <p className="text-gray-900 font-medium">{foundDrawing.drawingType}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditMode(true)
                    setEditData({
                      revision: foundDrawing.revision,
                      date: foundDrawing.date,
                      drawingType: foundDrawing.drawingType,
                    })
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  Update Drawing
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Revision</label>
                  <input
                    type="text"
                    value={editData.revision || ""}
                    onChange={(e) => handleEditChange("revision", e.target.value)}
                    placeholder="e.g., B, C, D..."
                    maxLength={2}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={editData.date || ""}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Drawing Type</label>
                    <select
                      value={editData.drawingType || ""}
                      onChange={(e) => handleEditChange("drawingType", e.target.value)}
                      className="input-field"
                    >
                      <option value="Manual">Manual (Board)</option>
                      <option value="Computer">Computer (CAD)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveUpdate}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Save Update
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
