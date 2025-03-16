"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Head from "next/head";

const SignInPage: FunctionComponent = () => {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formSchema = z.object({
    username: z.string().min(1, { message: "Username cannot be empty" }),
    password: z.string().min(1, { message: "Password cannot be empty" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  // const { callbackUrl } = router.query;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    let res;

    if (
      values.username.match(
        /(?:PES[12][UP]G\d{2}(?:AM|CS|EE|EC|ME|BT|CV)\d{3})|(?:PES[12]20\d{2}\d{5})/
      )
    ) {
      res = await signIn("pesu-auth", {
        username: values.username,
        password: values.password,
        redirect: false,
      });
      setLoading(false);

      if (res !== null && res!.ok) {
        router.push(
          // (callbackUrl as string) ||
          "/"
        );
      } else {
        if (res?.status === 401) setError("Invalid username or password");
        setError("An error occurred. Please try again.");
      }
    } else {
      res = await signIn("tix-auth", {
        username: values.username,
        password: values.password,
        redirect: false,
      });
      setLoading(false);

      if (res!.ok) {
        router.push("/redirect");
      } else {
        if (res?.status === 401) {
          setError("Invalid username or password");
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center gap-3 bg-background text-foreground">
      <Navbar hidelogin />
      <Card>
        <CardHeader>
          <CardTitle>Member Login</CardTitle>
          <CardDescription>
            Log in using your PESU Academy or club credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          <Form {...form}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
            {error && (
              <div className="text-red-500 p-2 text-sm w-full text-center">
                {error}
              </div>
            )}
            <Button
              variant="default"
              type="submit"
              className="w-full flex gap-x-3"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin text-primary-foreground" />
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
