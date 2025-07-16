import React, { useState } from "react";
import NavigationTools from "../components/NavigationTools";

export default function SharedFiles() {
  return (
    <div className="w-full h-full flex flex-col">
      <NavigationTools
        onSortChange={() => {}}
        onFilterChange={() => {}}
        onSearch={() => {}}
        onCreateFolder={() => {}}
        onToggleSidebar={() => {}}
        onUpload={() => {}}
      />
      <div className="flex flex-1 flex-col items-center justify-center w-full h-full text-center">
        <div className="text-2xl md:text-3xl font-semibold text-[#bdbdd7] mb-2">No shared files</div>
        <div className="text-[#bdbdd7] text-base">Nothing has been shared with you</div>
      </div>
    </div>
  );
} 