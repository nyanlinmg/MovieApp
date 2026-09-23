"use client"

import { getUserApi, RegisterCredentials, registerUserApi } from "@/services/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { useRouter } from "next/navigation";

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