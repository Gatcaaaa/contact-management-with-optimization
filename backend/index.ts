import express from 'express'
import cors from 'cors'
import { PrismaContactRepository } from './src/infra/PrismaContactRepository'
import { ContactService } from './src/service/ContactService'
import { ContactController } from './src/controller/ContactController'
import { prismaClient } from './src/lib/prisma'
import { ThirdPartyApiService } from './src/service/ThirdPartyApiService'
import { ReportController } from './src/controller/ReportController'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const thirdPartyService = new ThirdPartyApiService()
const contactRepository = new PrismaContactRepository(prismaClient)

const contactService = new ContactService(contactRepository, thirdPartyService)
const contactController = new ContactController(contactService)

const reportController = new ReportController()

const router = express.Router()

// contacts
router.get('/contacts', contactController.getAll)
router.post('/contacts', contactController.create)
router.put('/contacts/:id', contactController.update)
router.get('/contacts/queue', contactController.getQueueStatus)
router.post('/contacts/sync', contactController.sync)
router.delete('/contacts/queue', contactController.resetQueue)
router.get('/contacts/:id', contactController.getById)
router.delete('/contacts/:id', contactController.delete)

// reports
router.post('/reports/generate', reportController.generate)
router.get('/reports/:id', reportController.getById)

app.use('/api', router) // Prefix /api

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
