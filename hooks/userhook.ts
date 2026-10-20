"use client"

import { useApp } from "@/Provider/AppProvider";
import { getProfileDataApi, getUserApi, loginUserApi, registerUserApi, updateProfileApi } from "@/services/userServices";
import type { LoginCredentials, RegisterCredentials } from "@/services/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useGetProfileData = () => {
    const {
        data, isLoading, error, refetch, isError
    } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfileDataApi()
    });

    return {data, isLoading, error, refetch, isError}
}

export const useGetUser = () => {
    const {
        data: users,
        isLoading: isLoadingUsers,
        error: usersError,
        refetch: refetchUsers
    } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUserApi()
    });

    return {users, isLoadingUsers, usersError, refetchUsers}
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });
}

export const useLoginUser = () => {
    const router = useRouter();
    const {setAuth} = useApp();

    const mutation = useMutation({
        mutationFn: ({email, password} : LoginCredentials) => loginUserApi({email, password}),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            setAuth(data?.user);

            setTimeout(() => {
                router.push('/');
            },1000);
        },
        onError: (error: Error) => {
            console.log(error.message);
        }
    });

    return mutation;
}

export const useRegisterUser = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({name, email, username, password, image} : RegisterCredentials) => registerUserApi({
            name,email,username,password,image
        }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['users']});
            setTimeout(() => {
                router.push('/login');
            }, 1000)
        },
        onError: (error: Error) => {
            console.log(error.message);
        }
    });

    return mutation;
}
