"use client"

import { useApp } from "@/Provider/AppProvider"
import { getMediaStatusApi, toggleMediaApi } from "@/services/mediaServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMediaStatus = (kind: string, tmdbId: number, mediaType: string) => {
    const { auth } = useApp();

    const { data } = useQuery({
        queryKey: [kind, mediaType, tmdbId],
        queryFn: () => getMediaStatusApi(kind, tmdbId, mediaType),
        enabled: !!auth
    });

    return data?.active ?? false;
};

export const useToggleMedia = (kind: string, tmdbId: number, mediaType: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => toggleMediaApi(kind, tmdbId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [kind, mediaType, tmdbId]});
        },
        onError: (error: Error) => {
            console.log("Toggle failed", error.message);
        }
    });

    return mutation;
}