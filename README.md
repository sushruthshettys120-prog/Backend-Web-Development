# Hospital Appointment API

Prisma + TypeScript CRUD assignment.

## Setup
1. Create PostgreSQL database `hospital_api`.
2. Run the lesson DDL for `patients`, `doctors`, and `appointments`.
3. Copy `.env.example` to `.env` and set credentials.
4. Run:
   `npm install`
   `npx prisma db pull`
   `npx prisma generate`
   `npm run seed`
   `npm test`

## Assignment answers
1. `@@map` maps PascalCase Prisma model names to the existing lowercase/plural PostgreSQL tables without renaming or migrating them.
2. Deleting a doctor with appointments fails because of the foreign-key `ON DELETE RESTRICT` constraint. Delete or reassign the appointments first, or handle the constraint error.
3. `@db.Date` preserves a date-only PostgreSQL column, while `@db.Timestamp(6)` preserves timestamp columns with microsecond precision.
