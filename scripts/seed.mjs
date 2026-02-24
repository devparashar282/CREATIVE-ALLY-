import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import { courseSeed, internshipSeed } from "../data/catalog.mjs";
import { certificateSeed } from "../data/certificates.mjs";

if (typeof process.loadEnvFile === "function") {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      process.loadEnvFile(envFile);
    }
  }
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  await mongoose.connect(uri, { dbName: "creative-ally" });
  const db = mongoose.connection.db;

  await db.collection("courses").deleteMany({});
  await db.collection("internships").deleteMany({});
  await db.collection("certificates").deleteMany({});

  const now = new Date();

  await db.collection("courses").insertMany(
    courseSeed.map((course) => ({ ...course, active: true, createdAt: now, updatedAt: now }))
  );
  await db.collection("internships").insertMany(
    internshipSeed.map((internship) => ({ ...internship, active: true, createdAt: now, updatedAt: now }))
  );
  await db.collection("certificates").insertMany(certificateSeed);

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@creativeally.in").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "StrongAdminPassword@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.collection("users").updateOne(
    { email: adminEmail },
    {
      $set: {
        name: "Creative Ally Admin",
        email: adminEmail,
        countryCode: "+91",
        phone: "9999999999",
        passwordHash,
        role: "admin",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("Seed complete");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
