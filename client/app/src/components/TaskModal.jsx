import { useEffect, useMemo, useRef, useState } from "react";

function formatISOToMMDDYYYY(iso) {
  if (!iso) return "";
  const [yyyy, mm, dd] = iso.split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${mm}/${dd}/${yyyy}`;
}

function parseISODate(iso) {
  if (!iso) return null;
  const [yyyyRaw, mmRaw, ddRaw] = iso.split("-");
  const yyyy = Number(yyyyRaw);
  const mm = Number(mmRaw);
  const dd = Number(ddRaw);
  if (!yyyy || !mm || !dd) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

function toISODateString(d) {
  const yyyy = `${d.getFullYear()}`.padStart(4, "0");
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d, delta) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function addDays(d, delta) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function DatePickerInput({ label, value, onChange, placeholder = "MM/DD/YYYY" }) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  const selectedDate = useMemo(() => parseISODate(value), [value]);

  useEffect(() => {
    if (open) {
      if (selectedDate) setViewMonth(startOfMonth(selectedDate));
      else setViewMonth(startOfMonth(new Date()));
    }
  }, [open, selectedDate]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target)) return;
      setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const monthLabel = useMemo(() => {
    return viewMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [viewMonth]);

  const weeks = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const firstWeekday = first.getDay();
    const gridStart = addDays(first, -firstWeekday);
    const days = [];
    for (let i = 0; i < 42; i += 1) days.push(addDays(gridStart, i));
    const rows = [];
    for (let i = 0; i < 6; i += 1) rows.push(days.slice(i * 7, i * 7 + 7));
    return rows;
  }, [viewMonth]);

  const today = useMemo(() => new Date(), []);

  const select = (d) => {
    onChange(toISODateString(d));
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-left flex items-center justify-between"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatISOToMMDDYYYY(value) : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              ‹
            </button>
            <div className="text-sm font-semibold text-gray-900">{monthLabel}</div>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((d) => {
              const inMonth = d.getMonth() === viewMonth.getMonth();
              const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
              const isToday = isSameDay(d, today);
              const base = "h-9 w-9 mx-auto rounded-md text-sm flex items-center justify-center transition-colors";
              const state = isSelected
                ? "bg-blue-600 text-white"
                : isToday
                  ? "border border-blue-200 text-gray-900"
                  : "text-gray-900 hover:bg-gray-100";
              const monthTone = inMonth ? "" : "opacity-40";

              return (
                <button
                  key={toISODateString(d)}
                  type="button"
                  onClick={() => select(d)}
                  className={`${base} ${state} ${monthTone}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => select(new Date())}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskModal({ close, save, initialData }) {
  const [formData, setFormData] = useState({
    task_name: "",
    due_date: "",
    priority: "MEDIUM",
    status: "TODO",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        task_name: initialData.task_name || "",
        due_date: initialData.due_date || "",
        priority: initialData.priority || "MEDIUM",
        status: initialData.status || "TODO",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.task_name.trim()) {
      setError("Please enter a task name");
      return;
    }

    if (formData.due_date && !parseISODate(formData.due_date)) {
      setError("Invalid due date");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    save(formData);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
            ×
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
            <input
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              placeholder="e.g. Read Chapter 4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePickerInput
                label="Due Date"
                value={formData.due_date}
                onChange={(next) => setFormData((prev) => ({ ...prev, due_date: next }))}
                placeholder="MM/DD/YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add details..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              {initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
