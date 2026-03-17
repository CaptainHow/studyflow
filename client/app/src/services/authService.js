const BASE_URL = process.env.REACT_APP_BASE_URL;

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email_id: email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Login failed");
    }

    return data;
};

export const registerUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/user/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage =
            data.detail ||
            Object.entries(data)
                .map(([_, value]) => `${Array.isArray(value) ? value.join(", ") : value}`)
                .join(" | ") ||
            "Registration failed";

        throw new Error(errorMessage);
    }

    return data;
};

export const refreshAccessToken = async (refreshToken) => {
    const response = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Token refresh failed");
    }

    return data;
};
