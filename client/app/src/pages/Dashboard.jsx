import { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import CourseModal from "../components/CourseModal";
import ConfirmModal from "../components/ConfirmModal";
import { Link } from "react-router-dom";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message || "Failed to load courses");
      }
    };

    loadCourses();
  }, []);

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        const updatedCourse = await updateCourse(editingCourse.id, courseData);
        setCourses(courses.map((c) =>
          c.id === editingCourse.id ? updatedCourse : c
        ));
      } else {
        const newCourse = await createCourse(courseData);
        setCourses([...courses, newCourse]);
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save course");
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    try {
      await deleteCourse(deletingCourse.id);
      setCourses(courses.filter((c) => c.id !== deletingCourse.id));
      setDeletingCourse(null);
    } catch (err) {
      setError(err.message || "Failed to delete course");
    }
  };

  const openNewModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (course) => {
    setDeletingCourse(course);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  return (
    <AppLayout courses={courses}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Course
        </button>
      </div>
      {!courses.length && <div className="p-8 text-center text-gray-500">You don’t have any courses yet. Add one to start managing your tasks!</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.preventDefault(); openEditModal(course); }}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); openDeleteConfirm(course); }}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>

            <Link to={`/course/${course.id}`} className="block h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {course.course_code}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.course_name}</h3>
              <p className="text-gray-500 text-sm">View tasks and details →</p>
            </Link>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CourseModal
          close={closeModal}
          save={handleSaveCourse}
          initialData={editingCourse}
        />
      )}

      {deletingCourse && (
        <ConfirmModal
          title="Delete Course"
          message={`Are you sure you want to delete "${deletingCourse.course_name}"? This action cannot be undone.`}
          onConfirm={handleDeleteCourse}
          onCancel={() => setDeletingCourse(null)}
        />
      )}
    </AppLayout>
  );
}

export default Dashboard;
