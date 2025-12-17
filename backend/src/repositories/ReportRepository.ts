import type { Report } from '../../generated/prisma/client'

export interface IReportRepository {
  create(title: string): Promise<Report>
  updateStatus(id: number, status: string, fileData?: string): Promise<Report>
  findById(id: number): Promise<Report | null>
}
