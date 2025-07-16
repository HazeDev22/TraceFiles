import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaSortAlphaDown, FaFilter, FaFolderPlus, FaSearch } from "react-icons/fa";

export default function NavigationTools({
  onUpload,
  onSortChange,
  onFilterChange,
  onCreateFolder,
  onSearch,
  onToggleSidebar,
}) {
  // Dropdown state
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("name");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { key: "name", label: "Sort by Name" },
    { key: "date", label: "Sort by Date" },
    { key: "size", label: "Sort by Size" },
    { key: "downloads", label: "Sort by Downloads" },
  ];
  const filterOptions = [
    { key: "all", label: "All Items" },
    { key: "public", label: "Public" },
    { key: "private", label: "Private" },
    { key: "images", label: "Images" },
    { key: "video", label: "Video" },
    { key: "audio", label: "Audio" },
    { key: "documents", label: "Documents" },
    { key: "spreadsheets", label: "Spreadsheets" },
    { key: "presentations", label: "Presentations" },
    { key: "development", label: "Development" },
  ];

  const handleSortSelect = (key) => {
    setSelectedSort(key);
    setSortOpen(false);
    if (onSortChange) onSortChange(key);
  };
  const handleFilterSelect = (key) => {
    setSelectedFilter(key);
    setFilterOpen(false);
    if (onFilterChange) onFilterChange(key);
  };

  return (
    <div className="w-full bg-[#18122B] border-b border-[#2a213a] shadow-sm relative px-4 py-3">
      <div className="flex items-center w-full">
        {/* Hamburger icon visible only on mobile */}
        {onToggleSidebar && (
          <button
            className="block md:hidden text-2xl text-[#bdbdd7] focus:outline-none mr-2"
            onClick={onToggleSidebar}
            aria-label="Open menu"
          >
            &#9776;
          </button>
        )}
        {/* Toolbar buttons: icons only on mobile, icons+text on desktop */}
        <div className="flex items-center gap-2 mx-auto">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded bg-purple-400 text-[#18122B] font-bold hover:bg-purple-600 hover:text-white transition-colors"
            onClick={onUpload}
            aria-label="Upload"
          >
            <FaUpload className="text-lg" />
            <span className="hidden md:inline">Upload</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors relative"
            onClick={() => setSortOpen((v) => !v)}
            aria-label="Sort"
            ref={sortRef}
            type="button"
          >
            <FaSortAlphaDown className="text-lg" />
            <span className="hidden md:inline">Sort</span>
            {sortOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-[#23203a] border border-[#393053] rounded shadow-lg z-50 text-sm animate-fade-in">
                <div className="px-4 py-2 text-[#bdbdd7] font-semibold border-b border-[#393053]">Sort</div>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    className={`flex items-center w-full px-4 py-2 text-left hover:bg-purple-400 hover:text-white transition-colors ${selectedSort === opt.key ? "text-white" : "text-[#bdbdd7]"}`}
                    onClick={() => handleSortSelect(opt.key)}
                  >
                    {selectedSort === opt.key && <span className="mr-2">▲</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors relative"
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filter"
            ref={filterRef}
            type="button"
          >
            <FaFilter className="text-lg" />
            <span className="hidden md:inline">Filter</span>
            {filterOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-[#23203a] border border-[#393053] rounded shadow-lg z-50 text-sm animate-fade-in">
                <div className="px-4 py-2 text-[#bdbdd7] font-semibold border-b border-[#393053]">Filter</div>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    className={`flex items-center w-full px-4 py-2 text-left hover:bg-purple-400 hover:text-white transition-colors ${selectedFilter === opt.key ? "text-white" : "text-[#bdbdd7]"}`}
                    onClick={() => handleFilterSelect(opt.key)}
                  >
                    <span className="mr-2">{selectedFilter === opt.key ? "◉" : "○"}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors"
            onClick={onCreateFolder}
            aria-label="New Folder"
          >
            <FaFolderPlus className="text-lg" />
            <span className="hidden md:inline">New Folder</span>
          </button>
        </div>
        {/* Search bar: icon only on mobile, input with icon on desktop */}
        {onSearch && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            <button
              className="block md:hidden text-2xl text-[#bdbdd7] focus:outline-none"
              onClick={() => onSearch('')}
              aria-label="Search"
            >
              <FaSearch />
            </button>
            <div className="hidden md:block relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 rounded bg-[#18122B] border border-[#393053] text-[#f3f3f7] focus:border-purple-400 focus:outline-none w-48"
                onChange={e => onSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 