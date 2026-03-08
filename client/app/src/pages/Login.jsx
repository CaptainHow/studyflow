import { Link } from "react-router-dom";

function Login() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded shadow w-full max-w-md">

        <div className="text-center mb-6">

          <h1 className="text-xl font-semibold">
            StudyFlow
          </h1>

        </div>

        <h2 className="text-lg font-semibold mb-4">
          Log In
        </h2>

        <div className="space-y-3">

          <div>
            <label className="text-sm">
              Email
            </label>

            <input
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm">
              Password
            </label>

            <input
              type="password"
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

        <button className="mt-4 w-full bg-gray-400 py-2 rounded text-white">
          Log In
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?
          <Link className="ml-1 text-blue-600">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
