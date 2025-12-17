import { Job, Queue, Worker } from 'bullmq'
import { redisConnection } from '../config/redis'
import { PrismaContactRepository } from '../infra/PrismaContactRepository'
import { prismaClient } from '../lib/prisma'
import { PrismaReportRepository } from '../infra/PrismaReportRepository'
import { PdfGeneratorService } from '../service/PdfGeneratorService'

export const PDF_QUEUE_NAME = 'pdf-report-queue'

export const pdfQueue = new Queue(PDF_QUEUE_NAME, { connection: redisConnection })

const contactRepo = new PrismaContactRepository(prismaClient)
const reportRepo = new PrismaReportRepository(prismaClient)
const pdfService = new PdfGeneratorService()

export const pdfWorker = new Worker(
  PDF_QUEUE_NAME,
  async (job: Job) => {
    const { reportId } = job.data
    console.log(`[PdfWorker] Processing Report ID: ${reportId}`)

    try {
      await reportRepo.updateStatus(reportId, 'PROCESSING')
      const contacts = await contactRepo.findAll(0, 10000)

      const templateData = {
        generatedData: new Date().toLocaleString(),
        totalData: contacts.length,
        contacts: contacts,
      }

      const html = await pdfService.generateHtml('report', templateData)
      const pdfBuffer = await pdfService.cratePdfBuffer(html)

      const base64Pdf = pdfBuffer.toString('base64')
      await reportRepo.updateStatus(reportId, 'COMPLETED', base64Pdf)

      return { status: 'success', reportId }
    } catch (error: any) {
      console.error(`[PdfWorker] Failed:`, error)
      await reportRepo.updateStatus(reportId, 'FAILED')
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
)
