import prisma from "./lib/prisma";
import { createPatient, getPatient, searchPatients, updatePatientPhone, deletePatient } from "./patients";
import { createDoctor, getDoctor, listDoctorsBySpecialty, deleteDoctor } from "./doctors";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from "./appointments";

async function main() {
  console.log("── Patients ──────────────────────────");
  const patient = await createPatient({ name: "Test Patient", email: "test.patient@example.com", phone: "9999999999" });
  console.log("Created:", patient.name, patient.id);
  console.log("Found:", (await getPatient(patient.id)).name);
  console.log("Updated phone:", (await updatePatientPhone(patient.id, "8888888888")).phone);
  console.log("Search results:", (await searchPatients("Test")).length);

  console.log("── Doctors ───────────────────────────");
  const doctor = await createDoctor({ name: "Dr. Test", specialty: "General Medicine", email: "dr.test@hospital.io" });
  console.log("Created:", doctor.name, doctor.id);
  console.log("Found:", (await getDoctor(doctor.id)).name);
  console.log("General Medicine doctors:", (await listDoctorsBySpecialty("General")).length);

  console.log("── Appointments ──────────────────────");
  const appt = await bookAppointment(patient.id, doctor.id, new Date("2027-09-01T09:00:00"), "Initial consultation");
  console.log("Booked:", appt.id, "for", appt.patient.name);
  const full = await getAppointmentFull(appt.id);
  console.log("Full fetch:", full.patient.name, "with", full.doctor.name);
  console.log("Doctor schedule:", (await getDoctorUpcomingAppointments(doctor.id)).length, "appointment(s)");
  console.log("Status updated to:", (await setAppointmentStatus(appt.id, "cancelled")).status);
  console.log("Cancelled scheduled appointments:", await cancelAllPatientAppointments(patient.id));

  console.log("── Cleanup ───────────────────────────");
  await deleteAppointment(appt.id);
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log("Test data cleaned up.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
