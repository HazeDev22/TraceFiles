import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { FaBars, FaHome, FaClock, FaShareAlt, FaTrash } from "react-icons/fa";
import MyFiles from "./views/MyFiles";
import RecentFiles from "./views/RecentFiles";
import SharedFiles from "./views/SharedFiles";
import Trash from "./views/Trash";

const views = [
  { key: "myfiles", label: "My Files", icon: <FaHome className="text-lg" /> },
  { key: "recent", label: "Recent Files", icon: <FaClock className="text-lg" /> },
  { key: "shared", label: "Shared With Me", icon: <FaShareAlt className="text-lg" /> },
  { key: "trash", label: "Trash", icon: <FaTrash className="text-lg" /> },
];

function getViewContent(view) {
  switch (view) {
    case "myfiles":
      return <MyFiles />;
    case "recent":
      return <RecentFiles />;
    case "shared":
      return <SharedFiles />;
    case "trash":
      return <Trash />;
    default:
      return null;
  }
}

export default function Folder({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("myfiles");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-screen h-screen min-h-screen min-w-0 bg-[#18122B] text-[#f3f3f7] font-sans overflow-hidden">
      {/* Sidebar for desktop & mobile */}
      <Sidebar
        open={sidebarOpen || !isMobile}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        customLinks={views.map((v) => ({
          ...v,
          active: activeView === v.key,
          onClick: () => {
            setActiveView(v.key);
            setSidebarOpen(false);
          },
        }))}
      />
      {/* Hamburger for mobile only, never on desktop */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 text-2xl text-[#bdbdd7] focus:outline-none md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{ display: sidebarOpen ? "none" : "block" }}
        >
          <FaBars />
        </button>
      )}
      {/* Main content */}
      <main className="flex-1 w-full h-full min-h-0 min-w-0 bg-[#22203a] flex flex-col items-center justify-center text-center relative">
        {getViewContent(activeView)}
      </main>
    </div>
  );
}
