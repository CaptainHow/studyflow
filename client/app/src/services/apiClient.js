const BASE_URL = "http://127.0.0.1:8000/api";

const getAccessToken = () => localStorage.getItem("access");
const getRefreshToken = () => localStorage.getItem("refresh");

const saveAccessToken = (token) => {
    localStorage.setItem("access", token);
};

const clearTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

const refreshAccessToken = async () => {
    const refresh = getRefreshToken();

    if (!refresh) {
        throw new Error("No refresh token available");
    }

    const response = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
    });

    const data = await response.json();

    if (!response.ok) {
        clearTokens();
        throw new Error(data.detail || "Session expired. Please log in again.");
    }

    saveAccessToken(data.access);
    return data.access;
};

export const apiRequest = async (endpoint, options = {}, retry = true) => {
    const token = getAccessToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && retry) {
        try {
            const newAccessToken = await refreshAccessToken();

            const retryHeaders = {
                "Content-Type": "application/json",
                ...(options.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
            };

            const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
            });

            return retryResponse;
        } catch (err) {
            clearTokens();
            throw err;
        }
    }

    return response;
};
