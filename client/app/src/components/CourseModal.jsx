function CourseModal({ close }) {

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white rounded shadow p-6 w-full max-w-sm">

        <div className="flex justify-between mb-4">

          <h2 className="font-semibold">
            New Course
          </h2>

          <button onClick={close}>✕</button>

        </div>

        <div className="space-y-3">

          <input
            placeholder="Course Name"
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Code"
            className="w-full border p-2 rounded"
          />

        </div>

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={close}
            className="border px-3 py-1 rounded"
          >
            Cancel
          </button>

          <button className="bg-gray-200 px-3 py-1 rounded">
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default CourseModal;
