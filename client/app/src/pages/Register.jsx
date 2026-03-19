import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { registerUser } from "../services/authService";

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

  const selectedDate = useMemo(() => {
    return parseISODate(value);
  }, [value]);

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
        onClick={() => setOpen(v => !v)}
        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-left flex items-center justify-between"
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
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, -12))}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="Previous year"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, -1))}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center mx-2">
              <div className="text-sm font-bold text-gray-900 leading-tight">
                {viewMonth.getFullYear()}
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">
                {viewMonth.toLocaleString("en-US", { month: "long" })}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, 1))}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, 12))}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="Next year"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </div>
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

function Register() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    const emailOk = /^\S+@\S+\.\S+$/.test(formData.email);
    const passwordOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password);

    if (!emailOk) {
      setError("Please enter a valid email address");
      return;
    }

    if (!passwordOk) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.birthDate && !parseISODate(formData.birthDate)) {
      setError("Invalid birth date");
      return;
    }

    try {
      const userData = {
        email_id: formData.email,
        first_name: formData.firstName,
        middle_name: formData.middleName || null,
        last_name: formData.lastName,
        birth_date: formData.birthDate || null,
        password: formData.password,
      };

      await registerUser(userData);
      setSuccess(true);
      // navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100 my-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto flex items-center justify-center mb-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join StudyFlow to manage your learning journey.</p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <DatePickerInput
                label="Birth Date"
                value={formData.birthDate}
                onChange={(next) => setFormData(prev => ({ ...prev, birthDate: next }))}
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100 mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?
          <Link to="/" className="ml-1 text-blue-600 font-medium hover:underline">
            Log In
          </Link>
        </p>

      </div>
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center animate-fade-in">

            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ✓
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Registration Successful
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Your account has been created successfully.<br />
              You will be redirected in a few seconds...
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
