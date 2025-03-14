import { UserRole } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navbarLinks = (role: UserRole, id: string) => {
  const links = {
    ADMIN: [
      {
        title: "Clubs",
        link: "/clubs",
      },
    ],
    STUDENT: [],
    CLUB: [
      {
        title: "Profile",
        link: `/clubs/${id}`,
      },
    ],
  };
  return links[role];
};

export function getName(session: Session) {
  if (session.user.role === "STUDENT") {
    let name = "";

    for (let x of session.user.studentInfo!.name) {
      name += x[0].toUpperCase() + x.slice(1).toLowerCase();
    }
    return name;
  } else {
    return session.user.adminInfo?.name ?? session.user.clubInfo?.name;
  }
}
