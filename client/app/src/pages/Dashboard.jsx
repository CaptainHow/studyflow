import { useState } from "react";
import AppLayout from "../layout/AppLayout";
import CourseModal from "../components/CourseModal";

function Dashboard() {

  const [open, setOpen] = useState(false)

  const courses = [
    { id: 1, name: "ITECH" },
    { id: 2, name: "ML" },
    { id: 3, name: "Java" }
  ]

  return (

    <AppLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Your modules this semester
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-200 px-4 py-2 rounded w-full md:w-auto"
        >
          + New
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border rounded p-4"
          >
            {course.name}
          </div>
        ))}
      </div>
      {open && <CourseModal close={() => setOpen(false)} />}
    </AppLayout>

  )
}

export default Dashboard
