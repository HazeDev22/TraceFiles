import logo from "./asssets/logo.png";
import { FaTimes, FaHome, FaClock, FaShareAlt, FaTrash, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ onLogout, open = true, onClose, customLinks = [] }) {
  const sidebarClasses = `fixed top-0 left-0 z-50 h-full w-64 bg-[#18122B] shadow-lg transform transition-transform duration-300
    ${open ? 'translate-x-0' : '-translate-x-full'}
    md:static md:translate-x-0 md:w-64 md:h-screen`;

  return (
    <>
      {/* Overlay for mobile */}
      {onClose && open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={sidebarClasses}>
        {/* Close button for mobile */}
        {onClose && (
          <button
            className="absolute top-4 right-4 text-[#bdbdd7] hover:text-purple-400 text-2xl font-bold focus:outline-none md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        )}
        <img src={logo} alt="Doctracer Logo" className="w-20 h-20 mb-8 mx-auto" />
        <nav className="flex flex-col w-full gap-2 px-6 mt-8 md:mt-0">
          {customLinks.length > 0 ? (
            customLinks.map((link) => (
              <button
                key={link.key}
                className={`py-2 px-4 rounded text-left transition-colors font-semibold text-[#bdbdd7] hover:bg-[#393053] hover:text-purple-400 ${link.active ? 'bg-[#393053] text-purple-400' : ''} flex items-center gap-2`}
                onClick={link.onClick}
                style={{ outline: 'none' }}
              >
                {link.icon}
                {link.label}
              </button>
            ))
          ) : (
            <>
              <a
                href="#myfiles"
                className="flex items-center gap-2 py-2 px-4 rounded text-left hover:bg-[#393053] hover:text-purple-400 transition-colors font-semibold text-[#bdbdd7]"
              >
                <FaHome className="text-lg" />
                My Files
              </a>
              <a
                href="#recent"
                className="flex items-center gap-2 py-2 px-4 rounded text-left hover:bg-[#393053] hover:text-purple-400 transition-colors font-semibold text-[#bdbdd7]"
              >
                <FaClock className="text-lg" />
                Recent Files
              </a>
              <a
                href="#shared"
                className="flex items-center gap-2 py-2 px-4 rounded text-left hover:bg-[#393053] hover:text-purple-400 transition-colors font-semibold text-[#bdbdd7]"
              >
                <FaShareAlt className="text-lg" />
                Shared With Me
              </a>
              <a
                href="#trash"
                className="flex items-center gap-2 py-2 px-4 rounded text-left hover:bg-[#393053] hover:text-purple-400 transition-colors font-semibold text-[#bdbdd7]"
              >
                <FaTrash className="text-lg" />
                Trash
              </a>
            </>
          )}
          {onLogout && (
            <button
              className="mt-8 py-2 px-4 rounded bg-purple-400 text-[#18122B] font-bold hover:bg-purple-600 hover:text-white transition-colors flex items-center gap-2"
              onClick={onLogout}
            >
              <FaSignOutAlt className="text-lg" />
              Logout
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
