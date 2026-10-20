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

export interface ProfileMediaItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  date: string;
  rating: number;
};

export interface ProfileUser {
  id: number;
  name: string;
  username: string;
  email: string;
  image: string | null;
  createdAt: string;
}

export interface ProfileUpdate {
  name: string;
  username: string;
  email: string;
  image?: string | null;
}

export interface ProfileData {
  user: ProfileUser;
  favorites: ProfileMediaItem[];
  watchlist: ProfileMediaItem[];
};

export const getProfileDataApi = async () : Promise<ProfileData> => {
    return apiClient('/api/users/profile');
}

export const updateProfileApi = async (profile: ProfileUpdate): Promise<{ user: ProfileUser }> => {
    return apiClient('/api/users/profile', {
        method: 'PATCH',
        body: profile
    });
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
