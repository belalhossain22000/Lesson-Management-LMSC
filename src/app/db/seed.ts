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
  const teachers = await prisma.teacher.createMany({
    data: [
      { name: "Alice Johnson", email: "alice@lmsc.org" },
      { name: "Bob Williams", email: "bob@lmsc.org" },
      { name: "Charlie Evans", email: "charlie@lmsc.org" },
      { name: "Diana Carter", email: "diana@lmsc.org" },
      { name: "Edward Smith", email: "edward@lmsc.org" },
    ],
  });

  const teacherList = await prisma.teacher.findMany();

  console.log("🌱 Seeding students...");
  const students = await prisma.student.createMany({
    data: [
      { name: "Student A", email: "studentA@example.com" },
      { name: "Student B", email: "studentB@example.com" },
      { name: "Student C", email: "studentC@example.com" },
      { name: "Student D", email: "studentD@example.com" },
      { name: "Student E", email: "studentE@example.com" },
    ],
  });

  const studentList = await prisma.student.findMany();

  console.log("🌱 Seeding lessons + quiz + tasks...");

  const demoLessons = [
    {
      title: "Introduction to Calculus",
      description:
        "Learn the fundamentals of calculus including limits, derivatives, and integrals.",
      videoUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    },
    {
      title: "Chemistry Basics",
      description:
        "Explore the periodic table, atomic structure, and basic chemical reactions.",
      videoUrl: "https://www.youtube.com/embed/cRnkQqUbQOU",
    },
    {
      title: "Physics: Motion and Forces",
      description:
        "Understanding Newtons laws of motion and force interactions.",
      videoUrl: "https://www.youtube.com/embed/9u0EWekI3BA",
    },
    {
      title: "Biology: Cell Structure",
      description:
        "Learn about prokaryotic and eukaryotic cells, organelles, and their functions.",
      videoUrl: "https://www.youtube.com/embed/I04FN0pj7bQ",
    },
    {
      title: "Calculus – Derivatives",
      description: "Understanding the rate of change.",
      videoUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    },
  ];

  for (let i = 0; i < 5; i++) {
    const teacher = teacherList[i];

    const lesson = await prisma.lesson.create({
      data: {
        title: demoLessons[i].title,
        description: demoLessons[i].description,
        videoUrl: demoLessons[i].videoUrl,
        teacherId: teacher.id,
        publishedAt: new Date(),
      },
    });

    // Add 5 quiz questions per lesson
    const questions = [
      {
        questionText: "What is the main concept?",
        optionA: "A",
        optionB: "B",
        optionC: "C",
        optionD: "D",
        correctOption: "A",
      },
      {
        questionText: "Which statement is correct?",
        optionA: "Option 1",
        optionB: "Option 2",
        optionC: "Option 3",
        optionD: "Option 4",
        correctOption: "B",
      },
      {
        questionText: "Choose the best answer.",
        optionA: "Answer A",
        optionB: "Answer B",
        optionC: "Answer C",
        optionD: "Answer D",
        correctOption: "C",
      },
      {
        questionText: "What describes this lesson?",
        optionA: "Statement A",
        optionB: "Statement B",
        optionC: "Statement C",
        optionD: "Statement D",
        correctOption: "D",
      },
      {
        questionText: "Identify the correct concept.",
        optionA: "Yes",
        optionB: "No",
        optionC: "Maybe",
        optionD: "Depends",
        correctOption: "A",
      },
    ];

    for (const q of questions) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lesson.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
        },
      });
    }

    // Add lesson task
    await prisma.lessonTask.create({
      data: {
        lessonId: lesson.id,
        taskText: `Write a short summary about ${demoLessons[i].title}`,
      },
    });
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
