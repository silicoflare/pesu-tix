"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { createClub } from "../fx";
import { toast } from "sonner";
import { Campus } from "@prisma/client";

export default function CreateClub() {
  const formSchema = z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    confPass: z.string(),
    campus: z.string(),
    avatar: z
      .instanceof(File)
      .refine((x) => x.size < 1024 * 1024 * 5, {
        message: "File size must be less than 5MB",
      })
      .refine(
        (x) =>
          [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg",
          ].includes(x.type),
        {
          message: "File must be an image",
        }
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confPass: "",
      campus: "RR",
      avatar: undefined,
    },
  });

  const router = useRouter();

  async function formSubmit(data: z.infer<typeof formSchema>) {
    await createClub(
      data.name,
      data.username,
      data.password,
      data.campus as Campus,
      data.avatar
    );

    toast.success("Club created succcessfully!");
    router.push("/clubs");
  }

  return (
    <>
      <div className="random overflow-x-hidden mt-24">
        <Navbar />
        <span className="w-1/3 items-start">
          <Link
            className="text-sm flex items-center hover:underline"
            href="/clubs"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </Link>
        </span>
        <h1 className="w-1/3 text-3xl font-semibold text-left">Create Club</h1>
        <div className="w-1/3 my-2 items-center border rounded-md p-7">
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="confPass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="campus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Campus</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="RR" />
                        </FormControl>
                        <FormLabel className="font-normal">RR Campus</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="EC" />
                        </FormControl>
                        <FormLabel className="font-normal">EC Campus</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <br />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files![0])}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-7 w-full flex justify-end">
              <Button type="submit" onClick={form.handleSubmit(formSubmit)}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
