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
import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError("This password reset link is invalid or expired.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not reset your password.");
      }

      setMessage(data.message);
      setIsComplete(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not reset your password.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="px-5">
      <Card className="m-auto mt-15 max-w-lg border border-gray-600 bg-mist-900">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Choose a new password</CardTitle>
          <CardDescription className="text-mist-500">
            Your new password must be at least 8 characters long.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-mono text-lg text-white">
                New password
              </Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                className="bg-mist-900 py-5 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="confirm-password"
                className="font-mono text-lg text-white"
              >
                Confirm new password
              </Label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                className="bg-mist-900 py-5 text-white"
              />
            </div>

            {message && (
              <Alert className="border-green-500 bg-mist-800 text-green-500">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="border-red-500 bg-mist-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isComplete ? (
              <Button asChild className="w-full py-5 text-lg">
                <Link href="/login">Return to login</Link>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer py-5 text-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating password
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            )}
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
