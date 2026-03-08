import { useState } from "react";
import Sidebar from "../components/Sidebar";

function AppLayout({ children }) {

  const [open, setOpen] = useState(false);

  const courses = [
    { id: 1, name: "ITECH" },
    { id: 2, name: "ML" },
    { id: 3, name: "Java" }
  ];

  return (

    <div className="flex min-h-screen">

      <Sidebar courses={courses} open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-50">

        <div className="lg:hidden flex items-center border-b p-4">

          <button
            onClick={() => setOpen(true)}
            className="text-xl"
          >
            ☰
          </button>

          <span className="ml-4 font-semibold">
            StudyFlow
          </span>

        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {children}

        </div>

      </div>

    </div>
  );
}

export default AppLayout;
