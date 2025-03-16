import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type AuthedProps = {
  roles?: string[];
  nope?: boolean;
  match?: (RegExp | string)[];
  children: ReactNode;
};

export default function Authed({ roles, nope, match, children }: AuthedProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "";
  const userId = session?.user?.id ?? "";

  if (nope) {
    return !session ? children : null;
  }

  if (!session) {
    if (!roles || roles.includes("none")) {
      return children;
    }
    return null;
  }

  if (roles?.includes(userRole)) {
    if (match) {
      const roleIndex = roles.indexOf(userRole);
      if (roleIndex !== -1 && match[roleIndex] instanceof RegExp) {
        return (match[roleIndex] as RegExp).test(userId) ? children : null;
      } else if (roleIndex !== -1 && typeof match[roleIndex] === "string") {
        return match[roleIndex] === userId ? children : null;
      }
    }
    return children;
  }

  return null;
}
