import prisma from "../../shared/prisma";

async function main() {
  console.log("🌱 Clearing old data...");
  await prisma.lessonView.deleteMany();
  await prisma.taskSubmission.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.lessonTask.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();

  console.log("🌱 Seeding teachers...");
  await prisma.teacher.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@lmsc.org" },
      { name: "Bob Williams", email: "bob@lmsc.org" },
      { name: "Charlie Evans", email: "charlie@lmsc.org" },
      { name: "Diana Carter", email: "diana@lmsc.org" },
      { name: "Edward Smith", email: "edward@lmsc.org" },
    ],
  });

  const teachers = await prisma.teacher.findMany();

  console.log("🌱 Seeding students...");
  await prisma.student.createMany({
    data: [
      { name: "Student A", email: "studentA@example.com" },
      { name: "Student B", email: "studentB@example.com" },
      { name: "Student C", email: "studentC@example.com" },
      { name: "Student D", email: "studentD@example.com" },
      { name: "Student E", email: "studentE@example.com" },
    ],
  });

  const topics = [
    "Introduction to Calculus",
    "Limits & Continuity",
    "Derivatives",
    "Integrals",
    "Probability Basics",
    "Newton’s Laws",
    "Electric Circuits",
    "Organic Chemistry",
    "Cell Biology",
    "Kinematics",
    "Geometry Basics",
    "Fractions Fundamentals",
    "Human Digestive System",
    "Solar System Overview",
    "Photosynthesis",
    "Algebra Essentials",
    "States of Matter",
    "Water Cycle",
    "Atomic Structure",
    "Chemical Reactions",
  ];

  // related video URLs (looped)
  const videos = [
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM",
    "https://www.youtube.com/embed/WUvTyaaNkzM"
  ];

  console.log("🌱 Seeding lessons + quizzes + tasks...");

  let lessonCount = 0;

  for (const teacher of teachers) {
    for (let i = 0; i < 10; i++) {
      const index = (lessonCount + i) % topics.length;

      const lesson = await prisma.lesson.create({
        data: {
          title: topics[index],
          description: `This lesson covers important concepts about ${topics[index]}.`,
          videoUrl: videos[index % videos.length],
          teacherId: teacher.id,
          publishedAt: new Date(),
        },
      });

      // Generate unique quizzes for each lesson
      const quizQuestions = [
        {
          questionText: `What is the key idea behind ${topics[index]}?`,
          optionA: "Concept A",
          optionB: "Concept B",
          optionC: "Concept C",
          optionD: "Concept D",
          correctOption: "A",
        },
        {
          questionText: `Which statement about ${topics[index]} is true?`,
          optionA: "Option 1",
          optionB: "Option 2",
          optionC: "Option 3",
          optionD: "Option 4",
          correctOption: "B",
        },
        {
          questionText: `How does ${topics[index]} relate to real-world applications?`,
          optionA: "Method A",
          optionB: "Method B",
          optionC: "Method C",
          optionD: "Method D",
          correctOption: "C",
        },
        {
          questionText: `Identify the correct concept in ${topics[index]}.`,
          optionA: "Type A",
          optionB: "Type B",
          optionC: "Type C",
          optionD: "Type D",
          correctOption: "D",
        },
        {
          questionText: `Which example demonstrates ${topics[index]}?`,
          optionA: "Example A",
          optionB: "Example B",
          optionC: "Example C",
          optionD: "Example D",
          correctOption: "A",
        },
      ];

      for (const q of quizQuestions) {
        await prisma.quizQuestion.create({
          data: {
            lessonId: lesson.id,
            ...q,
          },
        });
      }

      await prisma.lessonTask.create({
        data: {
          lessonId: lesson.id,
          taskText: `Write a short summary explaining the topic: ${topics[index]}.`,
        },
      });

      lessonCount++;
    }
  }

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
