import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export async function Seeder() {
    console.log("User seeding started");
    
    await prisma.user.create({
        data: {
            name: "Alice",
            email: "alice@gmail.com",
            username: "alicekitty",
            password: await bcrypt.hash('password', 10)
        }
    });

    for(let i = 0; i < 5; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = firstName + lastName;

        await prisma.user.create({
            data: {
                name : `${fullName}`,
                username: `${fullName.toLocaleLowerCase()}`,
                email: `${firstName.toLocaleLowerCase()}@gmail.com`,
                password: await bcrypt.hash("password", 10)
            }
        })
    }

    console.log("User seeing finished");
    
}

Seeder();