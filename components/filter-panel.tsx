"use client"

interface FilterPanelProps {
  filters: {
    projectName: string
    drawingType: string
    revision: string
  }
  onFilterChange: (key: string, value: string) => void
  uniqueProjects: string[]
  uniqueTypes: string[]
  uniqueStatuses: string[]
  onClearAll: () => void
}

export default function FilterPanel({
  filters,
  onFilterChange,
  uniqueProjects,
  uniqueTypes,
  uniqueStatuses,
  onClearAll,
}: FilterPanelProps) {
  const activeFiltersCount = Object.values(filters).filter((v) => v).length

  return (
    <div className="lg:col-span-1">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2.5 py-0.5">{activeFiltersCount}</span>
          )}
        </div>

        {/* Project Name Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
          <select
            value={filters.projectName}
            onChange={(e) => onFilterChange("projectName", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {uniqueProjects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Drawing Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Drawing Type</label>
          <select
            value={filters.drawingType}
            onChange={(e) => onFilterChange("drawingType", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Revision</label>
          <select
            value={filters.revision}
            onChange={(e) => onFilterChange("revision", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Revisions</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
}
