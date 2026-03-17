import { apiRequest } from "./apiClient";

export const getCourses = async () => {
  const response = await apiRequest("/courses/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch courses");
  }

  return data;
};

export const createCourse = async (courseData) => {
  const response = await apiRequest("/courses/", {
    method: "POST",
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create course");
  }

  return data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await apiRequest(`/courses/${courseId}/`, {
    method: "PATCH",
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update course");
  }

  return data;
};

export const deleteCourse = async (courseId) => {
  const response = await apiRequest(`/courses/delete/${courseId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete course";
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
