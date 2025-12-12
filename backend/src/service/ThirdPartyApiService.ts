export interface ExternalContact {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export class ThirdPartyApiService {

    async fetchContacts(): Promise<ExternalContact[]> {
        await new Promise(resolve => setTimeout(resolve, 10000));

        return [
            {
                firstName: "Zaskiabsbsssas",
                lastName: "Adya Meccabbbbbsassadad",
                email: "zaskia.mecca@hijabbbbdadsasab.com",
                phoneNumber: "0835-5566-7788"
            }
        ];
    }
}