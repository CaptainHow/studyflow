import { useState, useMemo } from "react";

function TaskTable({ tasks, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [sortBy, setSortBy] = useState("due"); // due, priority, name

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = task.task_name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesPriority =
          filterPriority === "ALL" || task.priority === filterPriority;

        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => {
        if (a.status === "DONE" && b.status !== "DONE") return 1;
        if (a.status !== "DONE" && b.status === "DONE") return -1;
        if (sortBy === "due") {
          return new Date(a.due_date || 0) - new Date(b.due_date || 0);
        }

        if (sortBy === "name") {
          return a.task_name.localeCompare(b.task_name);
        }

        if (sortBy === "priority") {
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        return 0;
      });
  }, [tasks, search, filterPriority, sortBy]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return priority;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="due">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 pl-9 pr-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="p-4 w-12">Status</th>
              <th className="p-4">Task Name</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Priority</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className={`hover:bg-gray-50/50 transition-colors group ${task.status === "DONE" ? "bg-gray-50/70" : ""
                  }`}>
                  <td className="p-4">
                    <select
                      value={task.status}
                      onChange={(e) => onToggle(task, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <div
                      className={`font-medium text-gray-900 ${task.status === "DONE" ? "line-through text-gray-400" : ""
                        }`}
                    >
                      {task.task_name}
                    </div>
                    {task.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {task.due_date || "No due date"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;