"use client"

import { ArrowUpDown, Download } from "lucide-react"
import type { Drawing } from "@/types/drawing"

interface DrawingTableProps {
  drawings: Drawing[]
  sortBy: string
  sortOrder: "asc" | "desc"
  onSort: (field: string) => void
}

export default function DrawingTable({ drawings, sortBy, sortOrder, onSort }: DrawingTableProps) {
  const SortHeader = ({
    field,
    label,
  }: {
    field: string
    label: string
  }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-2 font-semibold text-white hover:text-blue-400 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={16}
        className={`transition-all ${
          sortBy === field ? "text-blue-400" : "text-slate-500 opacity-0 group-hover:opacity-100"
        } ${sortBy === field && sortOrder === "desc" ? "rotate-180" : ""}`}
      />
    </button>
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800">
            <th className="px-4 py-4 text-left group">
              <SortHeader field="projectName" label="Project Name" />
            </th>
            <th className="px-4 py-4 text-left group">
              <SortHeader field="jobNumber" label="Job #" />
            </th>
            <th className="px-4 py-4 text-left group">
              <SortHeader field="date" label="Date" />
            </th>
            <th className="px-4 py-4 text-left group">
              <SortHeader field="drawingTitle" label="Description" />
            </th>
            <th className="px-4 py-4 text-left group">
              <SortHeader field="drawingType" label="Type" />
            </th>
            <th className="px-4 py-4 text-left group">
              <SortHeader field="finalRevision" label="Rev" />
            </th>
            <th className="px-4 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drawings.map((drawing, index) => (
            <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-4">
                <span className="text-white font-medium text-sm">{drawing.projectName}</span>
              </td>
              <td className="px-4 py-4">
                <span className="text-slate-300 text-sm">{drawing.jobNumber}</span>
              </td>
              <td className="px-4 py-4">
                <span className="text-slate-300 text-sm">{drawing.date}</span>
              </td>
              <td className="px-4 py-4">
                <span className="text-slate-300 text-sm line-clamp-2">{drawing.drawingTitle}</span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    drawing.drawingType === "Manual"
                      ? "bg-orange-500/20 text-orange-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {drawing.drawingType}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="inline-block px-2 py-1 bg-slate-700 rounded text-xs font-medium text-slate-300">
                  {drawing.finalRevision}
                </span>
              </td>
              <td className="px-4 py-4">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  <Download size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
