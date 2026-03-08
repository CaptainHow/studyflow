import AppLayout from "../layout/AppLayout";
import TaskTable from "../components/TaskTable";

function CoursePage() {

  const tasks = [
    {
      id: 1,
      name: "Task A",
      due: "Jan 25 2024",
      priority: "High",
      done: false
    },
    {
      id: 2,
      name: "Task B",
      due: "Jan 30 2024",
      priority: "Medium",
      done: true
    },
    {
      id: 3,
      name: "Task C",
      due: "Feb 1 2024",
      priority: "Low",
      done: false
    }
  ]

  return (

    <AppLayout>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-semibold">
            ITECH
          </h1>

          <p className="text-gray-500">
            Course code: IT101
          </p>

          <p className="text-gray-500">
            Created: Jan 15 2024
          </p>

        </div>

        <button className="bg-gray-200 px-4 py-2 rounded w-full md:w-auto">
          + New
        </button>

      </div>

      <TaskTable tasks={tasks} />

    </AppLayout>

  )
}

export default CoursePage
