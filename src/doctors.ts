import prisma from "./lib/prisma";

export async function createDoctor(data: {
  name: string;
  specialty: string;
  email: string;
}) {
  return prisma.doctor.create({ data });
}

export async function getDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (doctor === null) throw new Error("Doctor not found");
  return doctor;
}

export async function listDoctorsBySpecialty(specialty: string) {
  return prisma.doctor.findMany({
    where: { specialty: { contains: specialty } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, specialty: true, email: true },
  });
}

export async function deleteDoctor(id: number) {
  return prisma.doctor.delete({ where: { id } });
}
