import { apiRequest } from "./apiClient";

export const getTasks = async () => {
    const response = await apiRequest("/tasks/", {
        method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch tasks");
    }

    return data;
};

export const createTask = async (taskData) => {
    const response = await apiRequest("/tasks/", {
        method: "POST",
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to create task");
    }

    return data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await apiRequest(`/tasks/${taskId}/`, {
        method: "PATCH",
        body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Failed to update task");
    }

    return data;
};

export const deleteTask = async (taskId) => {
    const response = await apiRequest(`/tasks/delete/${taskId}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        let errorMessage = "Failed to delete task";
        try {
            const data = await response.json();
            errorMessage = data.detail || errorMessage;
        } catch {
            // ignore json parse failure
        }
        throw new Error(errorMessage);
    }

    return true;
};
