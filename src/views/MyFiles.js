import React, { useState, useRef, useEffect } from "react";
import NavigationTools from "../components/NavigationTools";
import UploadModal from "../components/UploadModal";
import { FaHome,FaLink, FaEllipsisV, FaFolder, FaRegCopy } from "react-icons/fa";

// Modal for creating a folder
function CreateFolderModal({ open, onClose, onCreate }) {
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setFolderName("");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#232136] rounded-lg shadow-lg w-full max-w-md p-0 relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#393053]">
          <span className="text-lg font-semibold text-[#bdbdd7]">Create Folder</span>
          <button
            className="text-2xl text-[#bdbdd7] hover:text-purple-400 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-col items-start justify-center py-8 px-6 w-full">
          <label className="mb-2 text-[#bdbdd7] font-semibold">Give this folder a name</label>
          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-3 rounded bg-[#18122B] border border-[#393053] text-[#f3f3f7] focus:border-purple-400 focus:outline-none text-lg mb-2"
            placeholder="Folder name"
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && folderName.trim()) { onCreate(folderName.trim()); } }}
            maxLength={64}
          />
        </div>
        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-4 border-t border-[#393053] bg-[#232136] gap-2">
          <button
            className="px-6 py-2 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors text-base font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded font-bold transition-colors text-base ${!folderName.trim() ? 'bg-purple-400/50 text-white cursor-not-allowed' : 'bg-purple-400 text-[#18122B] hover:bg-purple-600 hover:text-white'}`}
            onClick={() => folderName.trim() && onCreate(folderName.trim())}
            disabled={!folderName.trim()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyFiles() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folders, setFolders] = useState([]); // Store created folders
  const [files, setFiles] = useState([]); // Store uploaded files
  const [menuOpenIdx, setMenuOpenIdx] = useState(null); // Track which menu is open
  const menuRefs = useRef([]);
  const [folderMenuOpenIdx, setFolderMenuOpenIdx] = useState(null); // Track which folder menu is open
  const folderMenuRefs = useRef([]);
  const [sortKey, setSortKey] = useState("name");
  const [filterKey, setFilterKey] = useState("all");

  // Handler to add uploaded files
  const handleUpload = (uploadedFiles) => {
    const now = new Date();
    setFiles((prev) => [
      ...prev,
      ...uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        fileObj: file, // keep the File object for preview
        uploadDate: now,
        downloads: 0, // static for now
      })),
    ]);
    setShowUploadModal(false);
  };

  // Handler to add a new folder
  const handleCreateFolder = (folderName) => {
    setFolders(prev => [
      ...prev,
      {
        name: folderName,
        created: new Date(),
        files: [],
        folders: [],
      },
    ]);
    setShowCreateFolder(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString();
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        menuOpenIdx !== null &&
        menuRefs.current[menuOpenIdx] &&
        !menuRefs.current[menuOpenIdx].contains(e.target)
      ) {
        setMenuOpenIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpenIdx]);

  // Close folder menu when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        folderMenuOpenIdx !== null &&
        folderMenuRefs.current[folderMenuOpenIdx] &&
        !folderMenuRefs.current[folderMenuOpenIdx].contains(e.target)
      ) {
        setFolderMenuOpenIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [folderMenuOpenIdx]);

  // Folder menu actions
  const handleFolderMenuAction = (action, folderIdx) => {
    setFolderMenuOpenIdx(null);
    if (action === "delete") {
      setFolders((prev) => prev.filter((_, idx) => idx !== folderIdx));
    }
    // Add rename logic as needed
  };

  // Example menu actions
  const handleMenuAction = (action, fileIdx) => {
    setMenuOpenIdx(null);
    if (action === "delete") {
      setFiles((prev) => prev.filter((_, idx) => idx !== fileIdx));
    }
    // Add more actions as needed
  };

  // Filtering logic
  const filterFile = (file) => {
    if (filterKey === "all") return true;
    if (filterKey === "public" || filterKey === "private") {
      // Placeholder: implement public/private logic if available
      return true;
    }
    if (filterKey === "images") return file.type.startsWith("image/");
    if (filterKey === "video") return file.type.startsWith("video/");
    if (filterKey === "audio") return file.type.startsWith("audio/");
    if (filterKey === "documents") return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
    if (filterKey === "spreadsheets") return ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type);
    if (filterKey === "presentations") return ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"].includes(file.type);
    if (filterKey === "development") return ["application/javascript", "text/x-python", "text/x-c", "text/x-c++", "text/x-java-source"].includes(file.type);
    return true;
  };

  // Sorting logic
  const sortFiles = (a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "date") return (b.uploadDate || 0) - (a.uploadDate || 0);
    if (sortKey === "size") return b.size - a.size;
    if (sortKey === "downloads") return b.downloads - a.downloads;
    return 0;
  };

  // Apply filter and sort
  const displayedFiles = files.filter(filterFile).sort(sortFiles);
  // Sort folders by name
  const displayedFolders = [...folders].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full h-full flex flex-col">
      <NavigationTools
        onSortChange={setSortKey}
        onFilterChange={setFilterKey}
        onSearch={() => {}}
        onCreateFolder={() => setShowCreateFolder(true)}
        onToggleSidebar={() => {}}
        onUpload={() => setShowUploadModal(true)}
      />
      <div className="flex-1 w-full h-full">
        {displayedFolders.length === 0 && displayedFiles.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center w-full h-full text-center">
            <div className="text-2xl md:text-3xl font-semibold text-[#bdbdd7] mb-2">
              This folder is empty
            </div>
            <div className="text-[#bdbdd7] text-base">
              You don't have any folders
            </div>
          </div>
        ) : (
          <div className="w-full mt-8 ml-1 text-left">
            <div className="flex items-center gap-2 text-[#bdbdd7] text-lg font-semibold mb-2">
              <span className="text-xl">
                <FaHome />
              </span>{" "}
              My Files
            </div>
            {/* Folders section */}
            {displayedFolders.length > 0 && (
              <>
                <div className="uppercase text-xs text-[#bdbdd7] font-bold mb-2 tracking-wider">
                  Folders
                </div>
                <ul className="mb-4">
                  {displayedFolders.map((folder, idx) => (
                    <li
                      key={folder.name + idx}
                      className="flex items-center px-4 py-3 group hover:bg-[#18122B] transition-colors rounded relative"
                    >
                      <div className="w-10 h-10 flex items-center justify-center mr-4">
                        <FaFolder className="text-3xl text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#f3f3f7] truncate">
                          <a href="#" className="hover:underline">
                            {folder.name}
                          </a>
                        </div>
                        <div className="text-xs text-[#bdbdd7] flex items-center gap-2">
                          <span>0 folders, 0 files</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-xs text-[#bdbdd7] whitespace-nowrap">
                          {formatDate(folder.created)}
                        </div>
                        <button
                          className="text-[#bdbdd7] hover:text-purple-400 mx-2"
                          title="Copy folder name"
                          onClick={() =>
                            navigator.clipboard.writeText(folder.name)
                          }
                        >
                          <FaLink />
                        </button>
                        <div
                          className="relative"
                          ref={(el) => (folderMenuRefs.current[idx] = el)}
                        >
                          <button
                            className="text-[#bdbdd7] hover:text-purple-400"
                            title="More options"
                            onClick={() => setFolderMenuOpenIdx(idx)}
                          >
                            <FaEllipsisV />
                          </button>
                          {/* Dropdown menu */}
                          {folderMenuOpenIdx === idx && (
                            <div className="absolute right-0 mt-2 w-36 bg-[#232136] border border-[#393053] rounded shadow-lg z-50">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-[#f3f3f7] hover:bg-purple-400 hover:text-white"
                                onClick={() =>
                                  handleFolderMenuAction("rename", idx)
                                }
                              >
                                Rename
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
                                onClick={() =>
                                  handleFolderMenuAction("delete", idx)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {/* Files section */}
            <div className="uppercase text-xs text-[#bdbdd7] font-bold mb-2 tracking-wider">
              Files
            </div>
            <ul className="bg-[#232136] rounded-lg shadow divide-y divide-[#393053] w-full px-0">
              {displayedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center w-full px-4 py-3 group hover:bg-[#18122B] transition-colors relative"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded overflow-hidden bg-[#393053] flex items-center justify-center mr-4">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file.fileObj)}
                        alt={file.name}
                        className="object-cover w-full h-full"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                      />
                    ) : (
                      <span className="text-[#bdbdd7] text-xs font-bold">
                        {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                      </span>
                    )}
                  </div>
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#f3f3f7] truncate">
                      <a href="#" className="hover:underline">
                        {file.name}
                      </a>
                    </div>
                    <div className="text-xs text-[#bdbdd7] flex items-center gap-2">
                      <span>{file.downloads} downloads</span>
                      <span className="mx-1">•</span>
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                  {/* Date and icons flush right */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-xs text-[#bdbdd7] whitespace-nowrap">
                      {formatDate(file.uploadDate)}
                    </div>
                    <button
                      className="text-[#bdbdd7] hover:text-purple-400 mx-2"
                      title="Copy link"
                    >
                      <FaLink />
                    </button>
                    <div
                      className="relative"
                      ref={(el) => (menuRefs.current[idx] = el)}
                    >
                      <button
                        className="text-[#bdbdd7] hover:text-purple-400"
                        title="More options"
                        onClick={() => setMenuOpenIdx(idx)}
                      >
                        <FaEllipsisV />
                      </button>
                      {/* Dropdown menu */}
                      {menuOpenIdx === idx && (
                        <div className="absolute right-0 mt-2 w-36 bg-[#232136] border border-[#393053] rounded shadow-lg z-50">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-[#f3f3f7] hover:bg-purple-400 hover:text-white"
                            onClick={() => handleMenuAction("download", idx)}
                          >
                            Download
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-[#f3f3f7] hover:bg-purple-400 hover:text-white"
                            onClick={() => handleMenuAction("rename", idx)}
                          >
                            Rename
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
                            onClick={() => handleMenuAction("delete", idx)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
      <CreateFolderModal
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}
