import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { INITIAL_COURSES } from "../data/mockData";

function AppLayout({ children, courses = INITIAL_COURSES }) {

  const [open, setOpen] = useState(false);

  return (

    <div className="flex min-h-screen">

      <Sidebar courses={courses} open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-50 flex flex-col min-w-0">

        <div className="lg:hidden flex items-center border-b bg-white p-4 sticky top-0 z-30">

          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6"/>
              <line x1="3" x2="21" y1="12" y2="12"/>
              <line x1="3" x2="21" y1="18" y2="18"/>
            </svg>
          </button>

          <span className="ml-3 font-semibold text-lg text-gray-900">
            StudyFlow
          </span>

        </div>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">

          {children}

        </div>

      </div>

    </div>
  );
}

export default AppLayout;
