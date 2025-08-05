const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create sample course
    const course = await prisma.course.create({
        data: {
            name: 'Frontend Web Development',
            description: 'Learn HTML, CSS, and JavaScript from scratch.',
            category: 'Web Development',
            totalLessons: 6,
            language: 'English',
            duration: 180, // 3 hours
        },
    });

    // Create modules
    const module1 = await prisma.module.create({
        data: {
            title: 'HTML Basics',
            courseId: course.id,
            lessons: {
                create: [
                    {
                        title: 'What is HTML?',
                        videoUrl: 'https://example.com/html-intro.mp4',
                        duration: 10,
                    },
                    {
                        title: 'HTML Tags',
                        videoUrl: 'https://example.com/html-tags.mp4',
                        duration: 12,
                    },
                ],
            },
        },
    });

    const module2 = await prisma.module.create({
        data: {
            title: 'CSS Styling',
            courseId: course.id,
            lessons: {
                create: [
                    {
                        title: 'CSS Basics',
                        videoUrl: 'https://example.com/css-basics.mp4',
                        duration: 15,
                    },
                    {
                        title: 'Box Model',
                        videoUrl: 'https://example.com/css-boxmodel.mp4',
                        duration: 20,
                    },
                ],
            },
        },
    });

    const module3 = await prisma.module.create({
        data: {
            title: 'JavaScript Fundamentals',
            courseId: course.id,
            lessons: {
                create: [
                    {
                        title: 'JS Syntax',
                        videoUrl: 'https://example.com/js-syntax.mp4',
                        duration: 18,
                    },
                    {
                        title: 'Variables & Data Types',
                        videoUrl: 'https://example.com/js-variables.mp4',
                        duration: 25,
                    },
                ],
            },
        },
    });

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error('❌ Error while seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
