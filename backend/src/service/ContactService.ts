import type { IContactRepository } from '../repositories/ContactRepository'
import type { ExternalContact, ThirdPartyApiService } from './ThirdPartyApiService'

export class ContactService {
  constructor(
    private contactRepository: IContactRepository,
    private thirdPartyService: ThirdPartyApiService,
  ) {}

  async getAllContacts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [contacts, totalItems] = await Promise.all([
      this.contactRepository.findAll(skip, limit),
      this.contactRepository.contactAll(),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: contacts,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    }
  }

  async fetctExternalDataForQueue(): Promise<ExternalContact[]> {
    return await this.thirdPartyService.fetchContacts()
  }

  async processSingleContact(item: ExternalContact) {
    const existing = await this.contactRepository.findByEmail(item.email)

    if (existing) {
      await this.contactRepository.update(existing.id, {
        first_name: item.firstName,
        last_name: item.lastName,
        phone: item.phoneNumber,
      })
      return { action: 'updated', email: item.email }
    } else {
      await this.contactRepository.create({
        first_name: item.firstName,
        last_name: item.lastName,
        email: item.email,
        phone: item.phoneNumber,
      })
    }
  }

  async getContactDetail(id: number) {
    const contact = await this.contactRepository.findById(id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return contact
  }

  async createContact(data: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }) {
    return this.contactRepository.create(data)
  }

  async updateContact(id: number, data: any) {
    await this.getContactDetail(id)
    return this.contactRepository.update(id, data)
  }

  async deleteContact(id: number) {
    await this.getContactDetail(id)
    return this.contactRepository.delete(id)
  }
}
