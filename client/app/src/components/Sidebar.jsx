import { Link } from "react-router-dom";

function Sidebar({ courses, open, setOpen }) {

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:static
        z-50
        w-64
        h-full
        bg-gray-100
        border-r
        transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        transition-transform
      `}
      >

        <div className="p-5 border-b font-semibold">
          StudyFlow
        </div>

        <div className="p-4 space-y-2">

          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/course/${c.id}`}
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              {c.name}
            </Link>
          ))}

          <button className="text-sm text-gray-600 mt-4">
            + New Course
          </button>

        </div>

        <button className="absolute bottom-0 w-full border-t p-4 text-sm">
          Logout
        </button>

      </div>
    </>
  );
}

export default Sidebar;
