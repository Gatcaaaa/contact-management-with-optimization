export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface PaginatedResponse {
    data: Contact[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    }
}