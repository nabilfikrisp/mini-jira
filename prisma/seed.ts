import db from "@/lib/db";
import { Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";

async function main() {
  const hashedPassword = await hash("password123");

  await db.user.createMany({
    data: [
      {
        email: "lead@example.com",
        password: hashedPassword,
        name: "Lead User",
        role: Role.LEAD,
      },
      {
        email: "team@example.com",
        password: hashedPassword,
        name: "Team User 1",
        role: Role.TEAM,
      },
      {
        email: "team2@example.com",
        password: hashedPassword,
        name: "Team User 2",
        role: Role.TEAM,
      },
    ],
  });

  console.log("Seeded initial users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
