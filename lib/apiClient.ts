type RequestOptions = {
    method?: string,
    body?: any
}

export default async function apiClient(endpoint: string, options: RequestOptions = {}) {
    const token = localStorage.getItem('token');

    const res = await fetch(endpoint, {
        method: options.method || 'GET',
        headers: {
            'Content-type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    if(!res.ok){
        const error = await res.json().catch(() => ({
            message: "Something went wrong"
        }));

        throw new Error(error.message || "request failed");
    }

    return res.json();
}