import type { Contact } from "../../generated/prisma/client";

export interface IContactRepository {
    findAll(skip: number, take: number): Promise<Contact[]>;
    contactAll(): Promise<number>
    findById(id: number): Promise<Contact | null>;
    create(data: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact>;
    update(id: number, data: Partial<Contact>): Promise<Contact>;
    delete(id: number): Promise<void>;
    findByEmail(email: string): Promise<Contact | null>
}