import type { PrismaClient, Report } from '../../generated/prisma/client'
import type { IReportRepository } from '../repositories/ReportRepository'

export class PrismaReportRepository implements IReportRepository {
  constructor(private prisma: PrismaClient) {}

  async create(title: string): Promise<Report> {
    return this.prisma.report.create({
      data: {
        title: title,
        status: 'PENDING',
      },
    })
  }
  async updateStatus(id: number, status: string, fileData?: string): Promise<Report> {
    return this.prisma.report.update({
      where: { id },
      data: {
        status,
        file_data: fileData,
      },
    })
  }
  findById(id: number): Promise<Report | null> {
    return this.prisma.report.findUnique({ where: { id } })
  }
}
