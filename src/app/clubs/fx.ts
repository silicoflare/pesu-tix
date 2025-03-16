"use server";

import db from "@/lib/db";
import { FileStorage } from "@/lib/storage";
import { convertImage } from "@/lib/utils";
import { Campus, Club } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";
import { lookup } from "mime-types";

export async function getClubList() {
  const store = new FileStorage();
  const clubs = await db.club.findMany();

  const clubList: (Omit<Club, "password"> & { avatar: string })[] = [];

  for (let club of clubs) {
    const img = convertImage(
      await store.getFile("clubs", `${club.username}/profile.jpg`)
    );

    clubList.push({
      username: club.username,
      name: club.name,
      campus: club.campus,
      links: club.links,
      avatar: img,
    });
  }

  return clubList;
}

export async function createClub(
  name: string,
  username: string,
  password: string,
  campus: Campus,
  avatar: File
) {
  const store = new FileStorage();

  await store.uploadFile(
    "clubs",
    `${username}/profile.jpg`,
    lookup(avatar.name) as string,
    Buffer.from(await avatar.arrayBuffer())
  );

  await db.club.create({
    data: {
      name,
      username,
      password: hashSync(password, genSaltSync()),
      campus,
    },
  });

  return 200;
}

export async function getClubData(username: string) {
  const store = new FileStorage();

  const club = await db.club.findFirst({
    where: {
      username,
    },
  });

  if (!club) {
    return null;
  }

  const { password, ...other } = club;

  const img = convertImage(
    await store.getFile("clubs", `${username}/profile.jpg`)
  );

  return { ...other, avatar: img };
}

export async function resetPassword(username: string, password: string) {
  await db.club.update({
    where: {
      username,
    },
    data: {
      password: hashSync(password, genSaltSync()),
    },
  });
}

export async function nameChange(username: string, name: string) {
  await db.club.update({
    where: {
      username,
    },
    data: {
      name,
    },
  });
}

export async function clubDelete(username: string) {
  const events = await db.event.findMany({
    where: {
      creatorID: username,
    },
  });

  for (let event of events) {
    await db.registration.deleteMany({
      where: {
        eventID: event.id,
      },
    });
    await db.event.delete({
      where: {
        id: event.id,
      },
    });
  }

  await db.club.delete({
    where: {
      username,
    },
  });
}

type ClubLink = {
  label: string;
  link: string;
  icon: string;
};

export async function updateLinks(username: string, links: ClubLink[]) {
  await db.club.update({
    where: {
      username,
    },
    data: {
      links,
    },
  });
}
