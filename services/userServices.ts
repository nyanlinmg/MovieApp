"use client"

import apiClient from "@/lib/apiClient"
import { UserType } from "@/types/global"

export interface LoginCredentials {
    email: string,
    password: string
}

export interface RegisterCredentials {
    name: string,
    email: string,
    username: string,
    password: string,
    image?: string
}

export const getUserApi = async () : Promise<UserType> => {
    return apiClient('/api/users/getUser');
}

export const registerUserApi = async ({name, email, username, password, image} : RegisterCredentials) : Promise<UserType | any> => {
    return apiClient('/api/auth/register', {
        method: 'POST',
        body: {name, email, username, password, image}
    })
}

export const loginUserApi = async ({email, password} : LoginCredentials) : Promise<{user: UserType, token:string}> => {
    return apiClient('/api/auth/login', {
        method: 'POST',
        body: {email, password}
    });
}