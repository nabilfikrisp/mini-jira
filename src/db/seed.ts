import { db } from "./drizzle";
import { users } from "./schema";
import { reset } from "drizzle-seed";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import { hash } from "argon2";

async function seed() {
  try {
    await reset(db, schema);
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);

    const hashedPassword = await hash("12345");

    const insertedUsers = await db
      .insert(users)
      .values([
        { username: "team_leader", password: hashedPassword, role: "LEAD" },
        { username: "team_member_1", password: hashedPassword, role: "TEAM" },
        { username: "team_member_2", password: hashedPassword, role: "TEAM" },
      ])
      .returning();

    console.log("Inserted users:", insertedUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit(0);
  }
}

seed();
