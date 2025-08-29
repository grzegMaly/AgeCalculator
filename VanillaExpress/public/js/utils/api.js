export async function api(path, {method="GET", body, headers} = {}) {
    const res = await fetch(`http://localhost:5000/api/v1${path}`, {
        method,
        credentials: 'include',
        headers: {"Content-Type": "application/json", ...(headers || {})},
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json()
        .catch(() => null);
    if (!res.ok) {
        const err = new Error(data?.message || `HTTP ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return data;
}
