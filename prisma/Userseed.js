const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordStudent = await bcrypt.hash("student123", 10);
    const passwordEmployer = await bcrypt.hash("employer123", 10);

    await prisma.user.createMany({
        data: [
            {
                first_name: "Ravi",
                last_name: "Sharma",
                email: "ravi.student@example.com",
                phone: "9876543210",
                password: passwordStudent,
                isStudent: true,
            },
            {
                first_name: "Priya",
                last_name: "Verma",
                email: "priya.employer@example.com",
                phone: "8765432109",
                password: passwordEmployer,
                isStudent: false,
            },
        ],
        skipDuplicates: true, // agar email same hua to skip karega
    });

    console.log("✅ Seed data inserted successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error inserting seed data:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
