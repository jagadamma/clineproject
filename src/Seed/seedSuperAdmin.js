const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const run = async () => {
    const email = 'superadmin@yourapp.com';
    const password = 'Admin@123'; // change in prod

    const exist = await prisma.admin.findUnique({ where: { email } });
    if (exist) {
        console.log('Super admin already exists:', email);
        process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await prisma.admin.create({
        data: {
            fullName: 'Super Admin',
            email,
            password: hash,
            isSuper: true,
            status: 'ACTIVE',
            scopes: { courses: ['read', 'write', 'delete'], coupons: ['read', 'write', 'delete'] },
        },
    });

    console.log('Created Super Admin:', email, '(pwd:', password, ')');
    process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
