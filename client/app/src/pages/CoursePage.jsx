import { useState } from "react";
import AppLayout from "../layout/AppLayout";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import { useParams } from "react-router-dom";
import { INITIAL_TASKS } from "../data/mockData";

function CoursePage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id ? { ...t, ...taskData } : t
      ));
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData
      };
      setTasks([...tasks, newTask]);
    }
    closeModal();
  };

  const handleDeleteTask = () => {
    if (deletingTask) {
      setTasks(tasks.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
    }
  };

  const handleToggleStatus = (task) => {
    const newStatus = task.status === "Done" ? "Todo" : "Done";
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    ));
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
          message={`Are you sure you want to delete "${deletingTask.name}"?`}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </AppLayout>
  );
}

export default CoursePage;
