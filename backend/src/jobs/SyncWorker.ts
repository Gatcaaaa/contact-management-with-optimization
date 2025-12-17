import { Job, Queue, Worker } from 'bullmq'
import { redisConnection } from '../config/redis'
import { PrismaContactRepository } from '../infra/PrismaContactRepository'
import { ThirdPartyApiService } from '../service/ThirdPartyApiService'
import { ContactService } from '../service/ContactService'
import { prismaClient } from '../lib/prisma'

export const SYNC_QUEUE_NAME = 'sync-contacts-queue'

export const syncQueue = new Queue(SYNC_QUEUE_NAME, {
  connection: redisConnection,
})

const contactRepo = new PrismaContactRepository(prismaClient)
const thirdPartyService = new ThirdPartyApiService()
const contactService = new ContactService(contactRepo, thirdPartyService)

export const syncWorker = new Worker(
  SYNC_QUEUE_NAME,
  async (job: Job) => {
    const contactData = job.data

    const result = await contactService.processSingleContact(contactData)
    return result
  },
  {
    connection: redisConnection,
    concurrency: 4,
    limiter: {
      max: 4,
      duration: 5000,
    },
  },
)

syncWorker.on('completed', (job) => {
  console.info(`[Job ${job.id}] Completed: ${JSON.stringify(job.returnvalue)}`)
})

syncWorker.on('failed', (job, err) => {
  console.error(`[Job ${job?.id}] Failed: ${err.message}`)
})
