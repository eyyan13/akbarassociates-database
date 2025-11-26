"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import type { Drawing } from "@/types/drawing"

interface ImportDrawingsProps {
  onImportComplete: (drawings: Drawing[]) => void
}

export default function ImportDrawings({ onImportComplete }: ImportDrawingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [importedData, setImportedData] = useState<Drawing[]>([])
  const [previewData, setPreviewData] = useState<Drawing[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [step, setStep] = useState<"upload" | "preview" | "confirm">("upload")

  const requiredFields = [
    "projectName",
    "jobNumber",
    "drawingTitle",
    "drawingNumber",
    "date",
    "cabinetFile",
    "drawingType",
    "revision",
    "finalRevision",
    "description",
  ]

  const parseCSV = (text: string): Drawing[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) {
      throw new Error("CSV khali hai ya header nahi hai")
    }

    const headers = lines[0].split(",").map((h) => h.trim())
    const drawings: Drawing[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.every((v) => !v)) continue

      const drawing: any = {}
      headers.forEach((header, index) => {
        drawing[header] = values[index] || ""
      })

      const missingFields = requiredFields.filter((field) => !drawing[field])
      if (missingFields.length > 0) {
        throw new Error(`Row ${i + 1} mein missing fields: ${missingFields.join(", ")}`)
      }

      drawing.soilBearingCapacity = Number.parseInt(drawing.soilBearingCapacity) || 0
      drawings.push(drawing)
    }

    return drawings
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    setErrorMessage("")
    setSuccessMessage("")

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      setErrorMessage("Sirf CSV ya TXT files upload kar sakte ho")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const drawings = parseCSV(text)

        if (drawings.length === 0) {
          setErrorMessage("File mein koi valid drawing nahi mila")
          return
        }

        setImportedData(drawings)
        setPreviewData(drawings.slice(0, 5))
        setStep("preview")
        setSuccessMessage(`${drawings.length} drawings import ke liye tayyar hain`)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "File parse mein error aaya")
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = () => {
    onImportComplete(importedData)
    setStep("confirm")
    setSuccessMessage(`Success! ${importedData.length} drawings add ho gaye`)
    setTimeout(() => {
      setIsOpen(false)
      setStep("upload")
      setImportedData([])
      setPreviewData([])
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Upload size={20} />
        CSV Import
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white">Drawings Import Kro</h2>
              <p className="text-slate-400 text-sm mt-1">CSV file se bulk drawings add kar sakte ho</p>
            </div>

            <div className="p-6">
              {step === "upload" && (
                <div>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <Upload className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="text-white font-semibold mb-1">CSV file drag kro ya click kro</p>
                    <p className="text-slate-400 text-sm mb-4">90k drawings tak support karti hai</p>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileInput}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="inline-block">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                        File Select Kro
                      </button>
                    </label>
                  </div>

                  <div className="mt-6 bg-slate-800 border border-slate-700 rounded p-4">
                    <p className="text-white font-semibold mb-2">CSV Format (required columns):</p>
                    <p className="text-slate-300 text-sm font-mono break-words">
                      projectName, jobNumber, drawingTitle, drawingNumber, date, cabinetFile, drawingType, revision,
                      finalRevision, description, soilBearingCapacity
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      Columns ka order matter nahi karti, sirf header names sahi hone chahiye
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const csv =
                        "projectName,jobNumber,drawingTitle,drawingNumber,date,cabinetFile,drawingType,revision,finalRevision,description,soilBearingCapacity\n" +
                        "Grace International,922-DU-02,Dyeing unit Layout Plan,922-DU-02-B,7/3/2025,CAB-01,Manual,B,B,Dyeing unit detail layout,250\n" +
                        "Sample Project,JN-001,Sample Drawing,DWG-001,1/15/2025,CAB-02,Computer,A,A,Sample description,300"
                      const element = document.createElement("a")
                      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv))
                      element.setAttribute("download", "sample-drawings.csv")
                      element.style.display = "none"
                      document.body.appendChild(element)
                      element.click()
                      document.body.removeChild(element)
                    }}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Sample CSV download kro
                  </button>
                </div>
              )}

              {step === "preview" && (
                <div>
                  <p className="text-slate-300 mb-4">Total {importedData.length} drawings milen. Pehle 5 ki preview:</p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-slate-300">Project</th>
                          <th className="text-left p-2 text-slate-300">Drawing#</th>
                          <th className="text-left p-2 text-slate-300">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((d, i) => (
                          <tr key={i} className="border-b border-slate-700">
                            <td className="p-2 text-slate-200">{d.projectName}</td>
                            <td className="p-2 text-slate-200">{d.drawingNumber}</td>
                            <td className="p-2 text-slate-200">{d.drawingType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {errorMessage && (
                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/50 rounded mb-4 text-red-400">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="flex gap-3 p-3 bg-green-500/10 border border-green-500/50 rounded mb-4 text-green-400">
                  <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700 p-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setStep("upload")
                  setImportedData([])
                  setErrorMessage("")
                }}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Close
              </button>
              {step === "preview" && (
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Import Confirm Kro ({importedData.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
