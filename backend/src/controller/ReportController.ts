import type { Request, Response } from 'express'
import { PrismaReportRepository } from '../infra/PrismaReportRepository'
import { prismaClient } from '../lib/prisma'
import { pdfQueue } from '../jobs/PdfWorker'

export class ReportController {
  private reportRepo = new PrismaReportRepository(prismaClient)

  generate = async (req: Request, res: Response) => {
    try {
      const title = `Contact Report - ${new Date().toISOString()}`
      const newReport = await this.reportRepo.create(title)

      await pdfQueue.add('generate-pdf', { reportId: newReport.id })

      res.json({
        message: 'Permintaan pembuatan pdf diterima',
        reportId: newReport.id,
        status: 'PENDING',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Gagal request PDF' })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id)
      const report = await this.reportRepo.findById(id)

      if (!report) {
        return res.status(404).json({ error: 'Report not found' })
      }

      res.json(report)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching report' })
    }
  }
}
