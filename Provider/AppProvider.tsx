"use client"

import apiClient from "@/lib/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type User = {
    id: number,
    email: string,
    name: string,
    username: string,
    password: string
} | null;

type AppContextType = {
    auth: User;
    setAuth: (user: User) => void;
    authLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({children} : {children: ReactNode}) {
    const [auth, setAuth] = useState<User>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [queryClient] = useState(() => new QueryClient());
    console.log(auth);

    useEffect(() => {
        async function verifyUser() {
            const token = localStorage.getItem("token");
            console.log(token);

            if(!token) {
                setAuthLoading(false);
                return;
            }

            try{
                const user = await apiClient('/api/users/verify', {
                    method: 'GET'
                });

                if(user){
                    setAuth(user);
                }else{
                    localStorage.removeItem("token");
                }

            }catch {
                localStorage.removeItem("token");
            }finally {
                setAuthLoading(false);
            }
        }

        verifyUser();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{auth, setAuth, authLoading}}>
                {children}
            </AppContext.Provider>
        </QueryClientProvider>
    )
}

export function useApp() {
    const context = useContext(AppContext);

    if(!context) {
        throw new Error("useApp must be used within an AppProvider");
    }

    return context;
}