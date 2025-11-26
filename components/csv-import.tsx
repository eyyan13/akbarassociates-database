"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import type { Drawing } from "@/types/drawing"

interface CsvImportProps {
  onImport: (drawings: Drawing[]) => void
}

export default function CsvImport({ onImport }: CsvImportProps) {
  const [preview, setPreview] = useState<Drawing[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const downloadTemplate = () => {
    const headers = ["Date", "Name of Project", "Job Nos", "REV.", "Description", "Manual / Computer"]
    const sampleRow = [
      "7/3/2025",
      "Grace International",
      "922-DU-02",
      "B",
      "Dyeing unit - Machine Layout Plan",
      "Manual",
    ]
    const csv = [headers.join(","), sampleRow.join(",")].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "drawing-template.csv"
    a.click()
  }

  const parseCSV = (text: string): Drawing[] => {
    const lines = text.trim().split("\n")
    const newErrors: string[] = []
    const drawings: Drawing[] = []

    // Skip empty lines at the beginning and find the header row
    let headerIndex = 0
    let headerRow: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = lines[i].split(",").map((v) => v.trim())

      // Look for header row with "Date" and "Name of Project"
      if (
        values.some((v) => v.toLowerCase().includes("date")) &&
        values.some((v) => v.toLowerCase().includes("project"))
      ) {
        headerIndex = i
        headerRow = values
        break
      }
    }

    if (headerRow.length === 0) {
      setErrors([
        "Could not find header row. Expected columns: Date, Name of Project, Job Nos, REV., Description, Manual / Computer",
      ])
      return []
    }

    // Process data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = lines[i].split(",").map((v) => v.trim())

      // Skip if no meaningful data
      if (!values.some((v) => v.length > 0)) continue

      const row: any = {}
      headerRow.forEach((header, idx) => {
        row[header.toLowerCase()] = values[idx] || ""
      })

      // Extract values - be flexible with column names
      const date = row["date"] || ""
      const projectName = row["name of project"] || ""
      const jobNumber = row["job nos"] || ""
      const revision = row["rev."] || row["revision"] || ""
      const description = row["description"] || ""
      const drawingTypeRaw = row["manual / computer"] || row["type"] || ""

      // Validation
      if (!projectName.trim()) {
        continue
      }
      if (!jobNumber.trim()) {
        newErrors.push(`Row ${i + 1}: Missing job number`)
        continue
      }

      const drawingType = drawingTypeRaw.toLowerCase().includes("computer") ? "Computer" : "Manual"

      const drawing: Drawing = {
        id: `${jobNumber}-${Date.now()}-${Math.random()}`,
        projectName: projectName.trim(),
        jobNumber: jobNumber.trim(),
        drawingTitle: description.split("(")[0].trim() || jobNumber,
        date: date || new Date().toISOString().split("T")[0],
        drawingType: drawingType as "Manual" | "Computer",
        revision: revision.trim(),
        preparedBy: "",
        description: description.trim(),
        cabinetFile: "",
        drawingNumber: jobNumber.trim(),
      }

      drawings.push(drawing)
    }

    setErrors(newErrors)
    return drawings
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const drawings = parseCSV(text)
      if (drawings.length > 0) {
        setPreview(drawings)
        setShowConfirmation(false)
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = () => {
    setShowConfirmation(true)
  }

  const handleFinalImport = () => {
    if (preview.length === 0) {
      alert("No valid drawings to import")
      return
    }
    onImport(preview)
    setPreview([])
    setErrors([])
    setShowConfirmation(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="card p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Drawings from CSV</h2>
        <p className="text-gray-600">Bulk import thousands of drawings at once</p>
      </div>

      {preview.length === 0 ? (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4 text-gray-400" size={40} />
            <p className="text-gray-700 font-medium mb-2">Drag and drop your CSV file here</p>
            <p className="text-gray-500 text-sm">or click to select</p>
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm mb-3">
              Need help? Download a sample template to see the correct CSV format:
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download size={18} />
              Download Template
            </button>
          </div>

          {/* Format Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Required CSV Columns:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                • <span className="font-mono">Date</span> - Drawing date (e.g., 7/3/2025)
              </li>
              <li>
                • <span className="font-mono">Name of Project</span> - Project name
              </li>
              <li>
                • <span className="font-mono">Job Nos</span> - Job number
              </li>
              <li>
                • <span className="font-mono">REV.</span> - Revision (optional)
              </li>
              <li>
                • <span className="font-mono">Description</span> - Drawing description
              </li>
              <li>
                • <span className="font-mono">Manual / Computer</span> - Drawing type
              </li>
            </ul>
          </div>
        </div>
      ) : !showConfirmation ? (
        <div className="space-y-6">
          {errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Warnings ({errors.length})</h3>
                  <div className="text-sm text-yellow-800 max-h-40 overflow-y-auto space-y-1">
                    {errors.map((error, idx) => (
                      <p key={idx}>• {error}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3 items-start">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-green-900 font-medium">
                  Ready to import <span className="font-bold">{preview.length}</span> drawings
                </p>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Project</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Job No</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Description</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Rev</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 15).map((drawing) => (
                  <tr key={drawing.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium text-sm">{drawing.projectName}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-sm">{drawing.jobNumber}</td>
                    <td className="px-4 py-3 text-gray-700 line-clamp-1 text-sm">{drawing.description}</td>
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
                    <td className="px-4 py-3 text-gray-700 font-mono text-sm">{drawing.revision || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {preview.length > 15 && (
            <p className="text-center text-gray-600 text-sm">Showing first 15 of {preview.length} drawings...</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirmImport}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Proceed to Import
            </button>
            <button
              onClick={() => {
                setPreview([])
                setErrors([])
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Confirmation Dialog */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Import</h3>
            <p className="text-gray-700 mb-6">
              You are about to import <span className="font-bold text-blue-600">{preview.length}</span> drawings into
              the system. This action cannot be undone. Do you want to proceed?
            </p>

            <div className="bg-white border border-blue-200 rounded p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Files to import:</span> {preview.length} drawings
              </p>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleFinalImport}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Yes, Import Now
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Review Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
