import { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import { useParams } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function CoursePage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        const filteredTasks = data.filter((task) => task.course === Number(id));
        setTasks(filteredTasks);
      } catch (err) {
        setError(err.message || "Failed to load tasks");
      }
    };

    loadTasks();
  }, [id]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map((t) =>
          t.id === editingTask.id ? updatedTask : t
        ));
      } else {
        const newTask = await createTask({
          ...taskData,
          course: Number(id),
        });
        setTasks([...tasks, newTask]);
      }

      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      await deleteTask(deletingTask.id);
      setTasks(tasks.filter((t) => t.id !== deletingTask.id));
      setDeletingTask(null);
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";

    try {
      const updatedTask = await updateTask(task.id, {
        status: newStatus,
      });

      setTasks(tasks.map((t) =>
        t.id === task.id ? updatedTask : t
      ));
    } catch (err) {
      setError(err.message || "Failed to update task status");
    }
  };

  const openNewModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (task) => {
    setDeletingTask(task);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <AppLayout>
      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Details</h1>
          <p className="text-gray-500 mt-1">Course ID: {id}</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Task
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm}
        onToggle={handleToggleStatus}
      />

      {isModalOpen && (
        <TaskModal
          close={closeModal}
          save={handleSaveTask}
          initialData={editingTask}
        />
      )}

      {deletingTask && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${deletingTask.task_name}"?`}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </AppLayout>
  );
}

export default CoursePage;
