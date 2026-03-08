function TaskTable({ tasks }) {

  return (
    <div className="bg-white border rounded">

      <div className="flex flex-col md:flex-row md:justify-between gap-3 p-3 border-b">

        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded">
            Filter
          </button>

          <button className="border px-3 py-1 rounded">
            Sort
          </button>
        </div>

        <input
          placeholder="Search"
          className="border p-1 rounded w-full md:w-48"
        />

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-[500px] w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Done</th>
              <th className="p-3 text-left">Task Name</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Priority</th>
            </tr>
          </thead>

          <tbody>

            {tasks.map((task) => (
              <tr key={task.id} className="border-b">

                <td className="p-3">
                  <input type="checkbox" defaultChecked={task.done} />
                </td>

                <td className="p-3">{task.name}</td>

                <td className="p-3">{task.due}</td>

                <td className="p-3">{task.priority}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TaskTable;
