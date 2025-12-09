import { prismaClient } from "../src/lib/prisma";

await prismaClient.contact.deleteMany()
console.log('Old data deleted.');

async function main() {
    console.log('🌱 Start seeding...');
    const contactsData = [
        {
            first_name: "Andi",
            last_name: "Saputra",
            email: "andi.saputra@example.com",
            phone: "0812-3456-7890"
        },
        {
            first_name: "Siti",
            last_name: "Aminah",
            email: "siti.aminah@testmail.com",
            phone: "0813-9876-5432"
        },
        {
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@global.com",
            phone: "+62-811-2233-4455"
        },
        {
            first_name: "Rina",
            last_name: "Marlina",
            email: "rinamarlina@domain.id",
            phone: "0857-1234-5678"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@tech.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techfsa.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techcacsa.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techfafea.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techsssa.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techdasa.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Budi",
            last_name: "Gunawan",
            email: "budi.g@techsasas.co.id",
            phone: "0896-1122-3344"
        },
        {
            first_name: "Siti",
            last_name: "Aminah",
            email: "siti.aminah@testmailscs.com",
            phone: "0813-9876-5432"
        },
        {
            first_name: "Siti",
            last_name: "Aminah",
            email: "siti.aminah@testmailqqq.com",
            phone: "0813-9876-5432"
        },
        {
            first_name: "Siti",
            last_name: "Aminah",
            email: "siti.aminah@testmaildsada.com",
            phone: "0813-9876-5432"
        },
    ];

    for (const contact of contactsData) {
        const result = await prismaClient.contact.create({
            data: contact
        })
        console.log(`Created contact: ${result.first_name} (${result.id})`);
    }
    console.log('🎉 Seeding finished.');
}
main()
    .then(async () => {
        await prismaClient.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prismaClient.$disconnect()
        process.exit(1)
    })