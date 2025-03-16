import { genSaltSync, hashSync } from "bcryptjs";
import db from "./lib/db";
import { FileStorage } from "./lib/storage";
import { lookup } from "mime-types";
import { readFileSync } from "fs";

await db.admin.deleteMany();
await db.club.deleteMany();
await db.student.deleteMany();

await db.admin.create({
  data: {
    username: "silicoflare",
    password: hashSync("password", genSaltSync()),
    name: "SilicoFlare",
  },
});

const image = readFileSync("public/profile.jpg");
const filestore = new FileStorage()

await filestore.uploadFile(
  "clubs",
  "nexus/profile.jpg",
  lookup(".jpg") as string,
  image
);

await db.club.create({
  data: {
    username: "nexus",
    name: "Nexus",
    campus: "RR",
    password: hashSync("nexus123", genSaltSync()),
  },
});
