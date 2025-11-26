"use client"

import type React from "react"

import { useState } from "react"
import type { Drawing } from "@/types/drawing"
import projectsData from "@/data/projects.json"

interface DataEntryFormProps {
  onAddDrawing: (drawing: Drawing) => void
}

export default function DataEntryForm({ onAddDrawing }: DataEntryFormProps) {
  const [formData, setFormData] = useState({
    projectName: "",
    jobNumber: "",
    drawingTitle: "",
    date: new Date().toISOString().split("T")[0],
    drawingType: "Manual" as const,
    revision: "A",
    preparedBy: "",
    description: "",
    customField1: "",
    customField2: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.projectName) newErrors.projectName = "Project is required"
    if (!formData.jobNumber) newErrors.jobNumber = "Job Number is required"
    if (!formData.drawingTitle) newErrors.drawingTitle = "Drawing Title is required"
    if (!formData.preparedBy) newErrors.preparedBy = "Prepared By is required"
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newDrawing: Drawing = {
      id: `${formData.jobNumber}-${Date.now()}`,
      ...formData,
    }

    onAddDrawing(newDrawing)

    // Reset form
    setFormData({
      projectName: "",
      jobNumber: "",
      drawingTitle: "",
      date: new Date().toISOString().split("T")[0],
      drawingType: "Manual",
      revision: "A",
      preparedBy: "",
      description: "",
      customField1: "",
      customField2: "",
    })
    setErrors({})
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Drawing</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Master Project Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Name <span className="text-red-600">*</span>
          </label>
          <select
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className={`input-field ${errors.projectName ? "border-red-500 focus:ring-red-500" : ""}`}
          >
            <option value="">Select a project...</option>
            {projectsData.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectName && <p className="text-red-600 text-sm mt-1">{errors.projectName}</p>}
        </div>

        {/* Job Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="jobNumber"
            value={formData.jobNumber}
            onChange={handleChange}
            placeholder="e.g., 922-DU-02"
            className={`input-field ${errors.jobNumber ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.jobNumber && <p className="text-red-600 text-sm mt-1">{errors.jobNumber}</p>}
        </div>

        {/* Drawing Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Drawing Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="drawingTitle"
            value={formData.drawingTitle}
            onChange={handleChange}
            placeholder="e.g., Foundation Plan"
            className={`input-field ${errors.drawingTitle ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors.drawingTitle && <p className="text-red-600 text-sm mt-1">{errors.drawingTitle}</p>}
        </div>

        {/* Grid for smaller fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" />
          </div>

          {/* Drawing Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Drawing Type</label>
            <select name="drawingType" value={formData.drawingType} onChange={handleChange} className="input-field">
              <option value="Manual">Manual (Board)</option>
              <option value="Computer">Computer (CAD)</option>
            </select>
          </div>

          {/* Revision */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Revision</label>
            <input
              type="text"
              name="revision"
              value={formData.revision}
              onChange={handleChange}
              placeholder="A, B, C..."
              maxLength={2}
              className="input-field"
            />
          </div>

          {/* Prepared By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prepared By <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="preparedBy"
              value={formData.preparedBy}
              onChange={handleChange}
              placeholder="Engineer name"
              className={`input-field ${errors.preparedBy ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.preparedBy && <p className="text-red-600 text-sm mt-1">{errors.preparedBy}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional details about the drawing..."
            rows={3}
            className="input-field"
          />
        </div>

        {/* Custom Fields - Space for future expansion */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Additional Fields (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Field 1</label>
              <input
                type="text"
                name="customField1"
                value={formData.customField1}
                onChange={handleChange}
                placeholder="Add as needed"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Field 2</label>
              <input
                type="text"
                name="customField2"
                value={formData.customField2}
                onChange={handleChange}
                placeholder="Add as needed"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Add Drawing
        </button>
      </form>
    </div>
  )
}
