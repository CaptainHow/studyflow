const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6">Page does not exist</p>
      <a href="/" className="text-blue-600 underline">
        Go back to login
      </a>
    </div>
  );
};

export default NotFound;
