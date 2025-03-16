import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  DefaultUser,
  User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import env from "@/env";
import db from "@/lib/db";
import { compareSync } from "bcryptjs";
import { Admin, Club, Student, UserRole } from "@prisma/client";
import { convertImage } from "@/lib/utils";
import { filestore } from "@/lib/storage";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: User;
  }

  export interface User extends DefaultUser {
    id: string;
    role: UserRole;
    studentInfo?: Omit<Student, "password"> | undefined;
    clubInfo?:
      | (Omit<Club, "password" | "links"> & { avatar: string })
      | undefined;
    adminInfo?: Omit<Admin, "password"> | undefined;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    role: UserRole;
    id: string;
    studentInfo?: Omit<Student, "password"> | undefined;
    clubInfo?:
      | (Omit<Club, "password" | "links"> & { avatar: string })
      | undefined;
    adminInfo?: Omit<Admin, "password"> | undefined;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        switch (user.role) {
          case "STUDENT":
            token.role = user.role;
            token.id = user.id;
            token.studentInfo = user.studentInfo;
            break;
          case "ADMIN":
            token.role = user.role;
            token.id = user.id;
            token.adminInfo = user.adminInfo;
            break;
          case "CLUB":
            token.role = user.role;
            token.id = user.id;
            token.clubInfo = user.clubInfo;
            break;
        }
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        role: token.role,
        id: token.id,
        studentInfo: token?.studentInfo,
        clubInfo: token?.clubInfo,
        adminInfo: token?.adminInfo,
      },
    }),
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  providers: [
    /**
     * PESU-auth to authenticate students
     */
    CredentialsProvider({
      name: "PESU Auth",
      id: "pesu-auth",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let user = null;
        const student = await db.student.findFirst({
          where: {
            prn: credentials!.username,
          },
        });

        if (student) {
          if (compareSync(credentials!.password, student.password)) {
            const { password, ...data } = student;
            user = {
              id: student.prn,
              role: "STUDENT" as "STUDENT",
              studentInfo: data,
            };
          }
        }
        // if user data could not be retrieved
        return user;
      },
    }),

    /**
     * Tix-auth to authenticate clubs and admins
     */
    CredentialsProvider({
      name: "Tix Auth",
      id: "tix-auth",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let user = null;

        const res = await db.club.findFirst({
          where: {
            username: credentials!.username,
          },
        });
        if (res && compareSync(credentials!.password, res.password)) {
          console.log(res);
          user = {
            role: "CLUB" as "CLUB",
            id: res.username,
            clubInfo: {
              username: res.username,
              name: res.name,
              campus: res.campus as Club["campus"],
              avatar: convertImage(
                await filestore.getFile("clubs", `${res.username}/profile.jpg`)
              ),
            },
          };
        } else {
          const res = await db.admin.findFirst({
            where: {
              username: credentials!.username,
            },
          });
          if (res && compareSync(credentials!.password, res.password)) {
            user = {
              role: "ADMIN" as "ADMIN",
              id: res.username,
              adminInfo: {
                username: res.username,
                name: res.name,
              },
            };
          } else {
            user = null;
          }
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};

export async function getSession(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as User) ?? null;
}
