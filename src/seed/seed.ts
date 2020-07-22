import { PrismaClient } from "@prisma/client";
import { data } from "./data";

const prisma = new PrismaClient();

const main = async () => {
  data.degrees.forEach(async (degree) => {
    await prisma.degree.create({ data: degree });
  });

  data.subjects.forEach(async ({ degreeId, ...subject }) => {
    await prisma.subject.create({
      data: {
        ...subject,
      },
    });
  });

  data.subjects.forEach(async ({ degreeId, id }) => {
    await prisma.degreeSubject.create({
      data: {
        degree: { connect: { id: degreeId } },
        subject: { connect: { id } },
      },
    });
  });
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
