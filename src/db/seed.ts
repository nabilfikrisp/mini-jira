import { hash } from "argon2";
import { db } from "./drizzle";
import { users } from "./schema";

async function seed() {
  try {
    const existingUsers = await db.select().from(users).limit(1);

    if (existingUsers.length > 0) {
      console.log("Users already exist. Skipping seeding.");
      return;
    }

    const hashedPassword = await hash("12345");

    await db
      .insert(users)
      .values([
        { username: "team_leader", password: hashedPassword, role: "LEAD" },
        { username: "team_member_1", password: hashedPassword, role: "TEAM" },
        { username: "team_member_2", password: hashedPassword, role: "TEAM" },
      ])
      .returning();

    console.log("Successfully seeded users.");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit(0); // Exit the process after seeding
  }
}

seed();
