"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useLoginUser } from "@/hooks/userhook";

export default function LoginForm() {
    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const { mutate, isPending, isError, error, isSuccess } = useLoginUser();

    const handleLogin = (e : React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({email, password})
    }

    const handleRest = () => {
        setEmail("");
        setPassword("");
    }

    return (
        <div className="px-5">
            <Card className="max-w-lg m-auto bg-mist-900 mt-15 border border-gray-600">
                <CardHeader className="mb-3">
                    <CardTitle className="text-white text-2xl">Login to your account</CardTitle>
                    <CardDescription className="text-mist-500 tracking-widest">
                        Enter your email below to login to your account
                    </CardDescription>

                    {isSuccess && 
                        <Alert className="max-w-md m-auto mt-3 bg-mist-800 border border-green-500 py-3 font-bold font-mono text-green-500">
                            <AlertCircleIcon />
                            <AlertTitle>Login Success</AlertTitle>
                            <AlertDescription className="text-green-500">Successfully logged in</AlertDescription>
                        </Alert>
                    }

                    {isError && 
                        <Alert variant="destructive" className="max-w-md m-auto mt-3 bg-mist-800 border border-red-500 py-3 font-bold font-mono">
                            <AlertCircleIcon />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{error?.message}</AlertDescription>
                        </Alert>
                    }
                </CardHeader>

                    <form onSubmit={handleLogin}>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label className="text-white text-lg font-mono" htmlFor="email">
                                        Email
                                    </Label>

                                    <Input
                                        id="email"
                                        onChange={(e) => setEmail(e.currentTarget.value)}
                                        type="email"
                                        value={email}
                                        className="text-white py-5 bg-mist-900"
                                        placeholder="...@gmail.com"
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <div className="flex items-center font-mono">
                                        <Label htmlFor="password" className="text-white text-lg">Password</Label>
                                        <a 
                                            href="#"
                                            className="ml-auto text-white inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password ?
                                        </a>
                                    </div>

                                    <Input 
                                        id="password"
                                        onChange={(e) => setPassword(e.currentTarget.value)}
                                        type="password"
                                        value={password}
                                        className="text-white py-5 bg-mist-900"
                                        placeholder="enter your password"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex-col gap-2 bg-mist-800 font-mono mt-8">
                            <Button 
                                type="submit"
                                disabled={isPending}
                                className="w-full cursor-pointer py-5 hover:bg-mist-200 hover:text-black text-lg transition"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Logging in
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            <Button
                                type="button"
                                onClick={handleRest}
                                className="w-full 
                                cursor-pointer py-5 mt-2 text-lg hover:bg-mist-900 border hover:text-white transition"
                            >
                                Reset
                            </Button>

                            <small className="text-white mt-3 text-sm">create a new account ? <a href="/register" className="hover:underline text-blue-400">register</a></small>
                        </CardFooter>
                    </form>
            </Card>
        </div>
    )
}