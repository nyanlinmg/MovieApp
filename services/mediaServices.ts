import apiClient from "@/lib/apiClient"

export const getMediaStatusApi = (kind: string, tmdbId: number, mediaType: string) => {
    return apiClient(`/api/users/${kind}?tmdbId=${tmdbId}&mediaType=${mediaType}`);
}

export const toggleMediaApi = (kind: string, tmdbId: number, mediaType: string) => {
    return apiClient(`/api/users/${kind}`, {
        method: "POST",
        body: {
            tmdbId,
            mediaType
        }
    });
}