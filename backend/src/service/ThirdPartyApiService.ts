export interface ExternalContact {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export class ThirdPartyApiService {

    async fetchContacts(): Promise<ExternalContact[]> {
        await new Promise(resolve => setTimeout(resolve, 3000));

        return [
            {
                firstName: "Rina",
                lastName: "Marlina (Senior Dev)", 
                email: "rinamarlina@domain.id",
                phoneNumber: "0857-1234-9999"
            },
            {
                firstName: "Joko",
                lastName: "Susilo",
                email: "joko.susilo@mail.com",
                phoneNumber: "0812-1111-2222"
            },
            {
                firstName: "Kartika",
                lastName: "Putri",
                email: "kartika.putri@sejahtera.id",
                phoneNumber: "0813-3333-4444"
            },
            {
                firstName: "Lukman",
                lastName: "Hakim",
                email: "lukman.hakim@univ.ac.id",
                phoneNumber: "0815-5555-6666"
            },
            {
                firstName: "Maria",
                lastName: "Kristina",
                email: "maria.kristina@hospital.com",
                phoneNumber: "0816-7777-8888"
            },
            {
                firstName: "Nanda",
                lastName: "Putra",
                email: "nanda.putra@startup.io",
                phoneNumber: "0817-9999-0000"
            },
            {
                firstName: "Olivia",
                lastName: "Jensen",
                email: "olivia.jensen@movie.net",
                phoneNumber: "0818-1122-3344"
            },
            {
                firstName: "Pandji",
                lastName: "Pragiwaksono",
                email: "pandji.p@comedy.com",
                phoneNumber: "0819-5566-7788"
            },
            {
                firstName: "Qory",
                lastName: "Sandioriva",
                email: "qory.s@beauty.id",
                phoneNumber: "0821-2233-4455"
            },
            {
                firstName: "Reza",
                lastName: "Rahadian",
                email: "reza.rahadian@actor.com",
                phoneNumber: "0822-6677-8899"
            },
            {
                firstName: "Susi",
                lastName: "Pudjiastuti",
                email: "susi.p@ocean.gov",
                phoneNumber: "0823-9988-7766"
            },
            {
                firstName: "Taufik",
                lastName: "Hidayat",
                email: "taufik.hidayat@badminton.org",
                phoneNumber: "0812-0000-9999"
            },
            {
                firstName: "Umar",
                lastName: "Wirahadikusumah",
                email: "umar.w@history.id",
                phoneNumber: "0813-1122-3344"
            },
            {
                firstName: "Vina",
                lastName: "Panduwinata",
                email: "vina.p@legend.com",
                phoneNumber: "0815-5566-7788"
            },
            {
                firstName: "Wawan",
                lastName: "Hendrawan",
                email: "wawan.h@goalie.com",
                phoneNumber: "0816-9900-1122"
            },
            {
                firstName: "Xavier",
                lastName: "Hernandez",
                email: "xavier.h@barca.es",
                phoneNumber: "0817-3344-5566"
            },
            {
                firstName: "Yusuf",
                lastName: "Mansur",
                email: "yusuf.m@paytren.id",
                phoneNumber: "0818-7788-9900"
            },
            {
                firstName: "Zainal",
                lastName: "Abidin",
                email: "zainal.a@lecture.edu",
                phoneNumber: "0819-1122-3344"
            }
        ];
    }
}