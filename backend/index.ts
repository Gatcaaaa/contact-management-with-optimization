import express from 'express';
import cors from "cors";
import { PrismaContactRepository } from './src/infra/PrismaContactRepository';
import { ContactService } from './src/service/ContactService';
import { ContactController } from './src/controller/ContactController';
import { prismaClient } from './src/lib/prisma';
import { ThirdPartyApiService } from './src/service/ThirdPartyApiService';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const thirdPartyService = new ThirdPartyApiService();
const contactRepository = new PrismaContactRepository(prismaClient);

const contactService = new ContactService(contactRepository, thirdPartyService);
const contactController = new ContactController(contactService);

const router = express.Router();

router.get('/contacts', contactController.getAll);
router.get('/contacts/:id', contactController.getById);
router.post('/contacts', contactController.create);
router.put('/contacts/:id', contactController.update);
router.delete('/contacts/:id', contactController.delete);
router.post('/contacts/sync', contactController.sync);

app.use('/api', router); // Prefix /api

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});