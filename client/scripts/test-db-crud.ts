import "dotenv/config";
import { db } from "../lib/db";
import { users, governmentProfiles, studentProfiles } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function runDatabaseCrudTest() {
  console.log("\n==============================================");
  console.log("🚀 Testing Neon PostgreSQL + Drizzle ORM CRUD");
  console.log("==============================================\n");

  const testFirebaseUid = `test_uid_${Date.now()}`;
  const testEmail = `test.innovator.${Date.now()}@jharkhand.gov.in`;

  try {
    // 1. CREATE
    console.log("1️⃣ [CREATE] Inserting new user...");
    const [createdUser] = await db
      .insert(users)
      .values({
        firebaseUid: testFirebaseUid,
        email: testEmail,
        displayName: "Ranchi District Officer",
        role: "government",
        state: "Jharkhand",
        district: "Ranchi",
        pinCode: "834001",
        isOnboarded: true,
      })
      .returning();

    console.log("✅ User created successfully:", createdUser.id, createdUser.email);

    // 2. CREATE Sub-profile
    console.log("2️⃣ [CREATE] Inserting government profile...");
    const [govProfile] = await db
      .insert(governmentProfiles)
      .values({
        userId: createdUser.id,
        department: "Department of Higher and Technical Education",
        designation: "Assistant Director",
      })
      .returning();
    console.log("✅ Government profile created:", govProfile.id, govProfile.department);

    // 3. READ
    console.log("3️⃣ [READ] Querying user with filters...");
    const [queriedUser] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, testFirebaseUid));
    console.log("✅ Found user:", queriedUser.displayName, "District:", queriedUser.district);

    // 4. UPDATE
    console.log("4️⃣ [UPDATE] Updating user designation in profile...");
    const [updatedGov] = await db
      .update(governmentProfiles)
      .set({ designation: "Joint Secretary" })
      .where(eq(governmentProfiles.userId, createdUser.id))
      .returning();
    console.log("✅ Profile updated to:", updatedGov.designation);

    // 5. DELETE (Cleanup)
    console.log("5️⃣ [DELETE] Cleaning up test records...");
    await db.delete(governmentProfiles).where(eq(governmentProfiles.userId, createdUser.id));
    await db.delete(users).where(eq(users.id, createdUser.id));
    console.log("✅ Cleaned up test record.");

    console.log("\n🎉 Full CRUD lifecycle passed successfully against Neon PostgreSQL!\n");
  } catch (error) {
    console.error("❌ CRUD Test failed:", error);
    console.log("\nNote: If you have not yet set DATABASE_URL in client/.env.local, set your Neon connection string.");
  }
}

runDatabaseCrudTest();
