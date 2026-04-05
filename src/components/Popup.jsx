const Popup = ({ isOpen, onClose, type, message }) => {
  // ------------------------------------------------------------------------
  // Render Logic & Styles
  // ------------------------------------------------------------------------
  if (!isOpen) return null;

  const isSuccess = type === "success";

  const bgColor = isSuccess
    ? "bg-green-100/20 border-green-500/30"
    : "bg-red-100/20 border-red-500/30";

  const textColor = isSuccess ? "text-green-600" : "text-red-500";

  const icon = isSuccess ? (
    <svg
      className="w-12 h-12 text-green-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ) : (
    <svg
      className="w-12 h-12 text-red-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div
        className={`relative flex flex-col items-center max-w-sm w-full p-6 text-center shadow-2xl rounded-2xl backdrop-blur-xl border ${bgColor} bg-white/80 scale-100 transition-transform duration-300`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {icon}

        <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
          {isSuccess ? "نجاح" : "خطأ"}
        </h3>

        <p className="text-gray-700 font-medium">{message}</p>

        <button
          onClick={onClose}
          className={` cursor-pointer mt-6 px-6 py-2 rounded-xl text-white font-medium transition-colors ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
        >
          حسناً
        </button>
      </div>
    </div>
  );
};

export default Popup;
