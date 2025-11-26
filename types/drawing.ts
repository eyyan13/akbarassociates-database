export interface Drawing {
  id: string
  projectName: string
  jobNumber: string
  drawingTitle: string
  date: string
  drawingType: "Manual" | "Computer"
  revision: string
  preparedBy: string
  description?: string
  cabinetFile?: string
  drawingNumber?: string
  soilBearingCapacity?: number
  customField1?: string
  customField2?: string
}
