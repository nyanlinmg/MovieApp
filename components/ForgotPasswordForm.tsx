"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setResetUrl("");
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not request a reset link.");
      }

      setMessage(data.message);
      if (
        process.env.NODE_ENV === "development" &&
        typeof data.resetUrl === "string"
      ) {
        setResetUrl(data.resetUrl);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not request a reset link.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="px-5">
      <Card className="m-auto mt-15 max-w-lg border border-gray-600 bg-mist-900">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Forgot your password?</CardTitle>
          <CardDescription className="text-mist-500">
            Enter your account email and we will send a password reset link.
          </CardDescription>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-mist-500">
              Without email settings, a local reset link appears here after you submit.
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-mono text-lg text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                className="bg-mist-900 py-5 text-white"
                placeholder="...@gmail.com"
              />
            </div>

            {message && (
              <Alert className="border-green-500 bg-mist-800 text-green-500">
                <AlertDescription>
                  <p>{message}</p>
                  {resetUrl && (
                    <a
                      href={resetUrl}
                      className="mt-2 inline-block font-semibold text-green-400 underline"
                    >
                      Open local reset link
                    </a>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="border-red-500 bg-mist-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer py-5 text-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending link
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center bg-mist-800 font-mono">
          <Link href="/login" className="text-blue-400 hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
