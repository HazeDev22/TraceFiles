import React, { useState } from "react";
import NavigationTools from "../components/NavigationTools";

export default function Trash() {
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
        <div className="text-2xl md:text-3xl font-semibold text-[#bdbdd7] mb-2">Trash is empty</div>
        <div className="text-[#bdbdd7] text-base">You haven't deleted any files</div>
      </div>
    </div>
  );
} 