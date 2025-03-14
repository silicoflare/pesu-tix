"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionWrapper({
  session,
  children,
}: {
  session: any;
  children: ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
