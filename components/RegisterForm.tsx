"use client"

import { useGetUser, useRegisterUser } from "@/hooks/userhook";
import { read } from "fs";
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Image, Loader2 } from "lucide-react";

export default function RegisterForm() {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [image, setImage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { mutate, isPending, isError, error, isSuccess, data } = useRegisterUser();
    const [preview, setPreview] = useState("");

    const handleReset = () => {
        setName("");
        setUsername("");
        setEmail("");
        setImage("");
        setPreview("");
        setPassword("");
    }

    const handleRegister = (e : React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({name, email, username, password, image});
    }  

    const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            setPreview(reader.result as string);
        };
        reader.onerror = () => {
            console.error("Failed to load file");
        }
        reader.readAsDataURL(file);
    }

    const { users } = useGetUser();
    console.log(users);

    return (
        <div className="max-w-120 m-auto">
            <Card className="max-w-lg m-auto bg-mist-900 mt-15 border border-gray-600 mb-6">
                <CardHeader className="mb-3">
                    <CardTitle className="text-white text-2xl">Create your new account</CardTitle>
                    <CardDescription className="text-mist-500 tracking-widest">
                        Enter the requirements below to register
                    </CardDescription>

                    {isSuccess && 
                        <Alert className="max-w-md m-auto mt-3 bg-mist-800 border border-green-500 py-3 font-bold font-mono text-green-500">
                            <AlertCircleIcon />
                            <AlertTitle>Register Success</AlertTitle>
                            <AlertDescription className="text-green-500">Created an account successfully</AlertDescription>
                        </Alert>
                    }

                    {isError && 
                        <Alert variant="destructive" className="max-w-md m-auto mt-3 bg-mist-800 border border-red-500 py-3 font-bold font-mono">
                            <AlertCircleIcon />
                            <AlertTitle>Register Failed</AlertTitle>
                            <AlertDescription>{error?.message}</AlertDescription>
                        </Alert>
                    }
                </CardHeader>

                    <form onSubmit={handleRegister}>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center">
                                    <Input
                                        type="file"
                                        accept="image/"
                                        id="image-upload"
                                        style={{display: 'none'}}
                                        onChange={handleImageChange}
                                    />
                                    <Label htmlFor="image-upload" className="cursor-pointer">
                                        {preview ? (
                                            <div>
                                                <img 
                                                    src={preview}
                                                    alt="preview"
                                                    style={{
                                                        width: 90,
                                                        height: 90,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '2px solid white'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                   width: 90,
                                                    height: 90,
                                                    borderRadius: '50%',
                                                    border: '2px dashed green',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'green' 
                                                }}
                                            >
                                                <Image />
                                                <p>Photo</p>
                                            </div>
                                        )}
                                    </Label>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-white text-lg font-mono" htmlFor="email">
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        onChange={(e) => setName(e.currentTarget.value)}
                                        type="text"
                                        value={name}
                                        className="text-white py-5 bg-mist-900"
                                        placeholder="enter your name"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-white text-lg font-mono" htmlFor="email">
                                        Username
                                    </Label>

                                    <Input
                                        id="username"
                                        onChange={(e) => setUsername(e.currentTarget.value)}
                                        type="text"
                                        value={username}
                                        className="text-white py-5 bg-mist-900"
                                        placeholder="enter your username"
                                    />
                                </div>

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
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Loading...
                                    </span>
                                ) : (
                                    "Register"
                                )}
                            </Button>

                            <Button
                                type="button"
                                onClick={handleReset}
                                disabled={isPending}
                                className="w-full 
                                cursor-pointer py-5 mt-2 text-lg hover:bg-mist-900 border hover:text-white transition"
                            >
                                Reset
                            </Button>

                            <small className="text-white mt-3 text-sm">already have an account ? <a href="/login" className="hover:underline text-blue-400">login</a></small>
                        </CardFooter>
                    </form>
            </Card>
        </div>
    )
}