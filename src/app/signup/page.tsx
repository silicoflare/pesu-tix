"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

function SignUp() {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const formSchema = z.object({
    prn: z.string().min(1, "PRN is required"),
    srn: z.string().min(1, "SRN is required"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().min(1, "Email is required"),
    program: z.string().min(1),
    branch: z.string().min(1),
    semester: z.string().min(1),
    section: z.string().min(1),
    campus: z.string().min(1),
    cycle: z.string().min(1),
    password: z.string().min(1, { message: "Password cannot be empty" }),
    confPass: z.string().min(1, { message: "Password cannot be empty" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prn: "",
      srn: "",
      name: "",
      phone: "",
      email: "",
      program: "BTech",
      branch: "CSE",
      semester: "Sem-1",
      section: "A",
      campus: "RR",
      cycle: "N/A",
      password: "",
      confPass: "",
    },
  });

  const router = useRouter();
  // const { callbackUrl } = router.query;

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confPass) {
      form.setError("password", { message: "Passwords don't match" });
      form.setError("confPass", { message: "Passwords don't match" });
    }

    const { confPass, ...other } = data;

    const res0 = await axios.get(`/api/student/exists?prn=${data.prn}`);

    if (res0.data.exists) {
      form.setError("prn", {
        message: "This PRN is already registered.",
      });
      return;
    }

    const res = await axios.post("/api/student/signup", {
      data: {
        ...other,
      },
    });

    if (res.status !== 201) {
      toast.error(res.statusText);
    } else {
      toast.success("Student created successfully!");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center gap-3 bg-background text-foreground">
      <Navbar hidelogin />
      <Card>
        <CardHeader>
          <CardTitle>Student Signup</CardTitle>
          <CardDescription>
            Create an account with your details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-3 w-full flex items-center justify-center">
          <Form {...form}>
            <div className="w-full grid grid-cols-2 justify-items-center gap-x-5 gap-y-3">
              <FormField
                control={form.control}
                name="prn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PRN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="srn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SRN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2 w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="campus"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Campus</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RR">RR Campus</SelectItem>
                          <SelectItem value="EC">EC Campus</SelectItem>
                          <SelectItem value="HN">HN Campus</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cycle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
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
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-red-500 p-2 text-sm w-full text-center col-span-2">
                  {error}
                </div>
              )}
              <div className="w-full col-span-2">
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
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
