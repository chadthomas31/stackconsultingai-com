import { hashSync } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Chad McCluskey",
      email: "chad@stackconsultingai.com",
      passwordHash: hashSync("admin123", 10),
      role: "admin",
      company: "Stack Consulting AI",
      phone: "949-749-0001",
    },
  });

  const client1 = await prisma.user.create({
    data: {
      name: "Dr. Sarah Woods",
      email: "sarah@drwoods.com",
      passwordHash: hashSync("client123", 10),
      role: "client",
      company: "Dr. Woods Dental",
      phone: "949-555-0101",
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: "Mike Rodriguez",
      email: "mike@titosauto.com",
      passwordHash: hashSync("client123", 10),
      role: "client",
      company: "Tito's Automotive Services",
      phone: "949-555-0202",
    },
  });

  const client3 = await prisma.user.create({
    data: {
      name: "Jennifer Park",
      email: "jen@midpacific.com",
      passwordHash: hashSync("client123", 10),
      role: "client",
      company: "Mid-Pacific Cleaning",
      phone: "808-555-0303",
    },
  });

  const proj1 = await prisma.project.create({
    data: {
      name: "Website Redesign & SEO",
      description: "Complete website overhaul with modern design, patient portal integration, and local SEO optimization.",
      status: "in_progress",
      progress: 65,
      startDate: new Date("2026-02-15"),
      dueDate: new Date("2026-04-15"),
      userId: client1.id,
    },
  });
  await prisma.milestone.createMany({
    data: [
      { title: "Design mockups approved", status: "completed", order: 1, completedAt: new Date("2026-03-01"), projectId: proj1.id },
      { title: "Frontend build complete", status: "completed", order: 2, completedAt: new Date("2026-03-15"), projectId: proj1.id },
      { title: "Patient portal integration", status: "in_progress", order: 3, dueDate: new Date("2026-03-30"), projectId: proj1.id },
      { title: "SEO optimization & launch", status: "pending", order: 4, dueDate: new Date("2026-04-15"), projectId: proj1.id },
    ],
  });

  const proj2 = await prisma.project.create({
    data: {
      name: "AI Phone Assistant Setup",
      description: "Custom AI voice assistant for appointment scheduling and service inquiries.",
      status: "review",
      progress: 90,
      startDate: new Date("2026-03-01"),
      dueDate: new Date("2026-03-30"),
      userId: client2.id,
    },
  });
  await prisma.milestone.createMany({
    data: [
      { title: "Voice flow design", status: "completed", order: 1, completedAt: new Date("2026-03-05"), projectId: proj2.id },
      { title: "AI assistant trained", status: "completed", order: 2, completedAt: new Date("2026-03-15"), projectId: proj2.id },
      { title: "Phone system integration", status: "completed", order: 3, completedAt: new Date("2026-03-20"), projectId: proj2.id },
      { title: "Client review & go-live", status: "in_progress", order: 4, dueDate: new Date("2026-03-30"), projectId: proj2.id },
    ],
  });

  const proj3 = await prisma.project.create({
    data: {
      name: "Google Business Automation",
      description: "Automated review management and Google Business Profile optimization.",
      status: "discovery",
      progress: 10,
      startDate: new Date("2026-04-01"),
      dueDate: new Date("2026-05-15"),
      userId: client2.id,
    },
  });

  const proj4 = await prisma.project.create({
    data: {
      name: "Booking System & Website",
      description: "Online booking system with service area mapping and automated client communications.",
      status: "in_progress",
      progress: 40,
      startDate: new Date("2026-03-10"),
      dueDate: new Date("2026-05-01"),
      userId: client3.id,
    },
  });

  await prisma.invoice.createMany({
    data: [
      { number: "SCA-2026-001", amount: 2500, status: "paid", paidAt: new Date("2026-02-20"), description: "Website Redesign - Phase 1 deposit", userId: client1.id, projectId: proj1.id },
      { number: "SCA-2026-002", amount: 2500, status: "sent", dueDate: new Date("2026-04-01"), description: "Website Redesign - Phase 2", userId: client1.id, projectId: proj1.id },
      { number: "SCA-2026-003", amount: 1800, status: "paid", paidAt: new Date("2026-03-05"), description: "AI Phone Assistant - Setup fee", userId: client2.id, projectId: proj2.id },
      { number: "SCA-2026-004", amount: 200, status: "sent", dueDate: new Date("2026-04-01"), description: "AI Phone Assistant - Monthly service", userId: client2.id, projectId: proj2.id },
      { number: "SCA-2026-005", amount: 3200, status: "draft", description: "Booking System - Full project", userId: client3.id, projectId: proj4.id },
    ],
  });

  await prisma.message.createMany({
    data: [
      { content: "Hi Chad, the new mockups look great! Can we add a patient testimonials section?", userId: client1.id, projectId: proj1.id, isAdmin: false },
      { content: "Absolutely! I'll add a testimonials carousel to the homepage. Should have it ready by end of week.", userId: client1.id, projectId: proj1.id, isAdmin: true },
      { content: "The AI assistant sounds amazing on test calls. My team is impressed!", userId: client2.id, projectId: proj2.id, isAdmin: false },
      { content: "Glad to hear it! Let's schedule the final review call for this week.", userId: client2.id, projectId: proj2.id, isAdmin: true },
      { content: "Can we include Maui in the service area map?", userId: client3.id, projectId: proj4.id, isAdmin: false },
    ],
  });

  console.log("Seed data created successfully!");
  console.log("  Admin: chad@stackconsultingai.com / admin123");
  console.log("  Client: sarah@drwoods.com / client123");
  console.log("  Client: mike@titosauto.com / client123");
  console.log("  Client: jen@midpacific.com / client123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
