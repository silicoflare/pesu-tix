"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  clubDelete,
  getClubData,
  nameChange,
  resetPassword,
  updateLinks,
} from "../fx";
import { date, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Authed from "@/components/Authed";
import Link from "next/link";
import {
  ChevronLeftIcon,
  KeyRoundIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PopoverClose } from "@radix-ui/react-popover";
import IconPicker from "@/components/IconPicker";

type ClubLink = {
  label: string;
  link: string;
  icon: string;
};

export default function ClubData({
  params,
}: {
  params: Promise<{ clubID: string }>;
}) {
  const router = useRouter();
  const { clubID } = use(params);
  const { data: session } = useSession();

  const [links, setLinks] = useState<ClubLink[]>([]);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const [delName, setDelName] = useState<string>("");
  const passwordRef = useRef(null);

  const { data: clubData, mutate } = useSWR("clubData", async () => {
    if (clubID) {
      return await getClubData(clubID);
    }
  });

  const formSchema = z.object({
    newPass: z.string(),
    confPass: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const changeNameFormSchema = z.object({
    name: z.string().min(5, "Name should be minimum 5 characters"),
  });

  const changeNameForm = useForm<z.infer<typeof changeNameFormSchema>>({
    resolver: zodResolver(changeNameFormSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data.newPass !== data.confPass) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.info("Changing password...");
    await resetPassword(clubData!.username, data.confPass);
    toast.success("Password successfully changed!");
  }

  async function changeName(data: z.infer<typeof changeNameFormSchema>) {
    toast.info("Changing club name...");
    await nameChange(clubData!.username, data.name);
    toast.success("Name changed successfully!");
    await mutate();
  }

  async function deleteClub() {
    await clubDelete(clubData!.username);
    toast.success("Club deleted successfully!");
    router.push("/clubs");
  }

  return (
    <div className="window">
      <Navbar />
      {clubData && (
        <div className="w-full h-full flex flex-col items-center mt-20">
          <Authed roles={["ADMIN"]}>
            <div className="my-10 w-1/3 flex flex-row items-center justify-between">
              <Link
                href="/clubs"
                className="flex flex-row items-center hover:underline cursor-pointer"
              >
                <ChevronLeftIcon />
                Back
              </Link>
              <div className="flex flex-row items-center justify-end gap-x-2">
                <Dialog>
                  <DialogTrigger
                    className="p-2 border rounded-md border-red-600 bg-red-600 text-white"
                    title="Delete Club"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Delete Club</DialogTitle>
                    <div className="">
                      Are you sure that you want to delete the club{" "}
                      <span className="font-bold">{clubData.name}</span> and all
                      associated events? This action is irreversible.
                    </div>
                    <div className="mt-5 text-sm flex flex-col items-center gap-2 w-full">
                      <span className="">
                        Type <span className="font-bold">{clubData.name}</span>{" "}
                        to delete the club.
                      </span>
                      <Input
                        value={delName}
                        onChange={(e) => setDelName(e.target.value)}
                      />
                      <DialogClose className="w-full">
                        <Button
                          className="w-full"
                          variant="destructive"
                          disabled={delName !== clubData.name}
                          onClick={(_) => deleteClub()}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Popover>
                  <PopoverTrigger
                    className="p-2 border rounded-md"
                    title="Change Password"
                  >
                    <KeyRoundIcon className="w-5 h-5" />
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col items-center w-full gap-2">
                    <h1 className="text-lg font-semibold">Change Password</h1>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                      >
                        <FormField
                          control={form.control}
                          name="newPass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confPass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <PopoverClose>
                          <Button className="w-full">Change Password</Button>
                        </PopoverClose>
                      </form>
                    </Form>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Authed>
          <h1 className="text-3xl font-bold flex items-start gap-2">
            {clubData.name}
            <Authed roles={["CLUB", "ADMIN"]} match={[clubID as string, /.*/]}>
              <Popover>
                <PopoverTrigger>
                  <PencilIcon size={12} />
                </PopoverTrigger>
                <PopoverContent>
                  <h1 className="text-lg w-full text-center font-bold">
                    Change Club Name
                  </h1>
                  <Form {...changeNameForm}>
                    <FormField
                      control={changeNameForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full flex items-center">
                      <Button
                        onClick={changeNameForm.handleSubmit(changeName)}
                        className="my-2 w-full"
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </PopoverContent>
              </Popover>
            </Authed>
          </h1>
          <span className="text-light">@{clubData.username}</span>
          <img
            src={clubData!.avatar}
            alt="club logo"
            className="w-52 h-52 mt-10"
          />
          <Authed roles={["CLUB"]} match={[clubID as string]}>
            <div className="flex flex-col items-center justify-end my-10 gap-2">
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    ref={passwordRef}
                  >
                    <KeyRoundIcon size={20} />
                    Change Password
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center w-full gap-2">
                  <h1 className="text-lg font-semibold">Change Password</h1>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-2"
                    >
                      <FormField
                        control={form.control}
                        name="newPass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confPass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <PopoverClose>
                        <Button className="w-full">Change Password</Button>
                      </PopoverClose>
                    </form>
                  </Form>
                </PopoverContent>
              </Popover>
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger className="w-full">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full"
                    ref={passwordRef}
                  >
                    <LinkIcon size={20} />
                    Social Links
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Social Links</DialogTitle>
                  </DialogHeader>
                  <div className="w-full flex flex-col items-center gap-2">
                    {links.map(({ label, link, icon }, i) => (
                      <div className="w-full flex items-center gap-3" key={i}>
                        <div className="flex flex-col items-start w-full gap-2">
                          <div className="flex items-center w-full gap-2">
                            <IconPicker
                              icon={icon}
                              onIconChange={(ico) =>
                                setLinks((old) => {
                                  const temp = Array.from(old);
                                  temp[i].icon = ico;
                                  return temp;
                                })
                              }
                            />
                            <Input
                              value={label}
                              onChange={(e) =>
                                setLinks((old) => {
                                  const temp = Array.from(old);
                                  temp[i].label = e.target.value;
                                  return temp;
                                })
                              }
                            />
                          </div>
                          <Input
                            value={link}
                            onChange={(e) =>
                              setLinks((old) => {
                                const temp = Array.from(old);
                                temp[i].link = e.target.value;
                                return temp;
                              })
                            }
                          />
                        </div>
                        <Trash2Icon
                          size={30}
                          className="text-red-600 cursor-pointer"
                          onClick={(_) =>
                            setLinks((old) => {
                              const temp = Array.from(old);
                              temp.splice(i, 1);
                              return temp;
                            })
                          }
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={(_) =>
                          setLinks((old) => [
                            ...old,
                            { label: "", link: "", icon: "" },
                          ])
                        }
                      >
                        <PlusIcon size={20} />
                        Add Link
                      </Button>
                      <Button
                        className="w-full flex items-center gap-2"
                        onClick={async (_) => {
                          if (
                            !links.every((x) => x.label !== "" || x.link !== "")
                          ) {
                            toast.error("Links or labels cannot be empty");
                            return;
                          }
                          await updateLinks(clubData!.username, links);
                          toast.success("Links updated successfully!");
                          setLinkDialogOpen(false);
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Authed>
          {clubData.links && (
            <div className="w-1/4 flex flex-col items-center gap-2 mt-10">
              {(clubData.links as ClubLink[]).map(({ icon, link, label }) => (
                <Link
                  href={link}
                  target="_blank"
                  className="w-full flex items-center gap-3 justify-center p-2 text-xl border border-foreground rounded-md transition duration-200 hover:bg-accent hover:border-accent"
                  key={label}
                >
                  <IconPicker icon={icon} onIconChange={(s) => null} disabled />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
