"use client";

// import ThemeButton from "./ThemeButton";
import { TicketIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getName, navbarLinks } from "@/lib/utils";

export default function Navbar({ hidelogin = false }: { hidelogin?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();

  // const [avatarURL, setAvatarURL] = useState("");

  // useEffect(() => {
  //   async function getAvatarURL() {
  //     if (session && session?.user.role === "CLUB" && session.user.clubInfo) {
  //       const url = await nhost.storage.getPublicUrl({
  //         fileId: session.user.clubInfo?.avatar || "",
  //       });
  //       setAvatarURL(url);
  //     }
  //   }

  //   getAvatarURL();
  // }, [session]);

  return (
    <div
      className={`w-full flex flex-row items-center justify-between px-7 py-7 basic fixed top-0 left-0 bg-transparent z-10`}
    >
      <h1 className="font-semibold text-2xl cursor-pointer flex flex-row gap-x-3 items-center">
        <Link href="/">{/* <TicketIcon className="-rotate-45" /> */}</Link>
      </h1>
      <span className="flex flex-row items-center justify-end cursor-pointer gap-x-3">
        {!!session?.user ? (
          session.user.role === "CLUB" ? (
            <div className="flex items-center gap-2 mx-10">
              <Link href={"/events"}>Events</Link>
            </div>
          ) : session.user.role === "ADMIN" ? (
            <div className="flex items-center gap-2 mx-10">
              <Link href={"/clubs"}>Clubs</Link>
            </div>
          ) : null
        ) : null}
        {/* <ThemeButton /> */}
        {!hidelogin &&
          (!!session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${session.user.id}`}
                  ></AvatarImage>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 mt-2">
                <DropdownMenuLabel className="font-semibold text-lg">
                  {getName(session)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navbarLinks(session.user.role, session.user.id).map(
                  ({ title, link }) => (
                    <DropdownMenuItem
                      key={title}
                      onClick={(_) => router.push(link)}
                    >
                      {title}
                    </DropdownMenuItem>
                  )
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () =>
                    router.push(
                      (
                        await signOut({
                          redirect: false,
                          callbackUrl: "/login",
                        })
                      ).url
                    )
                  }
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-24"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
              <Button className="w-24" onClick={() => signIn()}>
                Login
              </Button>
            </div>
          ))}
      </span>
    </div>
  );
}
