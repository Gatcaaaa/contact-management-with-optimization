import type { ContactService } from "../service/ContactService";
import type { Request, Response } from 'express';

export class ContactController {
    constructor(private contactService: ContactService) { }

    getAll = async (req: Request, res: Response) => {
        try {

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.contactService.getAllContacts(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    sync = async (req: Request, res: Response) => {
        try {
            const result = await this.contactService.syncContactsWithThirdParty();
            res.json(result);
        } catch (error) {
            console.error("Sync Error:", error);
            res.status(500).json({ error: 'Failed to synchronize data' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const contact = await this.contactService.getContactDetail(id);
            res.json(contact);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const contact = await this.contactService.createContact(req.body);
            res.status(201).json(contact);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create contact' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const contact = await this.contactService.updateContact(id, req.body);
            res.json(contact);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await this.contactService.deleteContact(id);
            res.json({ message: 'Contact deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };
}