import type { Contact, PrismaClient } from "../../generated/prisma/client";
import type { IContactRepository } from "../repositories/ContactRepository";

export class PrismaContactRepository implements IContactRepository {
    constructor(private prisma: PrismaClient) { }
    async contactAll(): Promise<number> {
        return this.prisma.contact.count()
    }
    async findAll(skip: number, take: number): Promise<Contact[]> {
        return this.prisma.contact.findMany({
            skip: skip,
            take: take,
            orderBy: { created_at: "desc" }
        })

    }
    async findById(id: number): Promise<Contact | null> {
        return this.prisma.contact.findUnique({ where: { id } });
    }
    async findByEmail(email: string): Promise<Contact | null> {
        return this.prisma.contact.findUnique({ where: { email } });
    }
    async create(data: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
        return this.prisma.contact.create({ data });
    }
    async update(id: number, data: Partial<Contact>): Promise<Contact> {
        return this.prisma.contact.update({
            where: { id },
            data
        });
    }
    async delete(id: number): Promise<void> {
        await this.prisma.contact.delete({ where: { id } });
    }
}