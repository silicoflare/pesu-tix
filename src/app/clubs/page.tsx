"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import { getClubList } from "./fx";

export default function ClubsPage() {
  const router = useRouter();

  const { data: clubList } = useSWR("clubs", getClubList);

  return (
    <div className="random">
      <Navbar />
      <div className="w-full flex flex-col items-center mt-5">
        <h1 className="text-3xl font-semibold my-5 mt-20 w-3/4 px-7 flex flex-row items-center justify-between">
          All Clubs
          <Button
            className="flex flex-row items-center gap-x-2"
            onClick={(_) => router.push("/clubs/create")}
          >
            <PlusIcon /> Add Club
          </Button>
        </h1>
        <div className="w-3/4 p-7 ">
          {clubList ? (
            clubList.length > 0 ? (
              <div className="grid grid-cols-3 w-full gap-3 items-center justify-center">
                {clubList.map((club) => {
                  return (
                    <Card
                      className="transition hover:scale-105 duration-300 ease-in-out hover:bg-accent cursor-pointer"
                      onClick={(_) => router.push(`/clubs/${club.username}`)}
                      key={club.username}
                    >
                      <CardContent className="flex flex-row items-center gap-x-7">
                        <Avatar className="w-24 h-24 p-0">
                          <AvatarImage
                            src={club.avatar}
                            width={20}
                            height={20}
                          />
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-xl">{club.name}</span>
                          <span className="font-light">
                            {club.campus} Campus
                          </span>
                          <span className="font-light">@{club.username}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="w-full">
                <h1 className="w-full text-center text-gray-600 text-2xl">
                  No clubs yet
                </h1>
              </div>
            )
          ) : (
            <div className="w-full">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

ClubsPage.auth = {
  role: ["admin"],
};
