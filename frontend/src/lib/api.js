async function request(path, options = {}) {
    const res = await fetch(path, {
        credentials: "include", // send/receive the session cookie
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
        throw new Error((data && data.error) || `Request failed (${res.status})`);
    }
    return data;
}

export const api = {
    get: (path) => request(path),
    post: (path, body) =>
        request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
};