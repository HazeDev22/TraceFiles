import React, { useRef, useState } from "react";
import { FaFolder, FaFileAlt, FaFileImage } from "react-icons/fa";
import { APIService } from '../hooks/fetchApi';

function getFileIcon(file) {
  // Add safety check
  if (!file || !file.type) return <FaFileAlt className="text-[#bdbdd7]" />;
  if (file.type.startsWith("image/")) return <FaFileImage className="text-blue-400" />;
  return <FaFileAlt className="text-[#bdbdd7]" />;
}

function getFolderName(path) {
  if (!path) return null;
  const parts = path.split("/");
  return parts.length > 1 ? parts.slice(0, -1).join("/") : null;
}

export default function UploadModal({ open, onClose, onUpload }) {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  if (!open) return null;

  // Group files by folder (for display) with safety checks
  const filesByFolder = {};
  selectedFiles.filter(file => file != null).forEach((file) => {
    const folder = getFolderName(file.webkitRelativePath || "");
    if (folder) {
      if (!filesByFolder[folder]) filesByFolder[folder] = [];
      filesByFolder[folder].push(file);
    } else {
      if (!filesByFolder[""]) filesByFolder[""] = [];
      filesByFolder[""] = [...(filesByFolder[""] || []), file];
    }
  });

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    
    // Filter out null/undefined files
    const files = Array.from(e.target.files).filter(file => file != null);
    setSelectedFiles(files);
    setProgress(files.map(() => 0));
    setUploadErrors([]);
  };

  const handleAddFile = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!e.dataTransfer.files) return;
    
    // Filter out null/undefined files
    const files = Array.from(e.dataTransfer.files).filter(file => file != null);
    setSelectedFiles(files);
    setProgress(files.map(() => 0));
    setUploadErrors([]);
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadErrors([]);
    const initialProgress = selectedFiles.map(() => 0);
    setProgress([...initialProgress]);

    try {
      await uploadFilesIndividually();
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadErrors([error.message || 'Upload failed']);
    } finally {
      setUploading(false);
    }
  };

  const uploadFilesIndividually = async () => {
    // Filter out null/undefined files before processing
    const validFiles = selectedFiles.filter(file => file != null);
    
    const uploadPromises = validFiles.map(async (file, index) => {
      // Double-check file exists
      if (!file || !file.name) {
        console.warn('Skipping invalid file:', file);
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_path', getFolderName(file.webkitRelativePath) || '');
      formData.append('original_path', file.webkitRelativePath || file.name);

      try {
        const response = await APIService.uploadFile({
          url: 'upload',
          formData: formData,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = percent;
              return newProgress;
            });
          }
        });

        if (response.response && response.response.status >= 400) {
          throw new Error(response.response.data?.message || 'Upload failed');
        }

        return { file, response: response.data, index };
      } catch (error) {
        // Safe file name access
        const fileName = file?.name || 'Unknown file';
        setUploadErrors(prev => [...prev, `${fileName}: ${error.message}`]);
        throw error;
      }
    });

    const results = await Promise.allSettled(uploadPromises);
    const successfulUploads = results
      .filter(result => result.status === 'fulfilled' && result.value != null)
      .map(result => result.value);

    if (successfulUploads.length > 0) {
      setTimeout(() => {
        onUpload && onUpload(successfulUploads.map(upload => upload.response));
        setSelectedFiles([]);
        setProgress([]);
        onClose();
      }, 500);
    }
  };

  const uploadFilesAsFormData = async () => {
    const formData = new FormData();
    
    // Filter out null/undefined files
    const validFiles = selectedFiles.filter(file => file != null);
    
    validFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
      formData.append(`paths[${index}]`, file.webkitRelativePath || file.name);
    });

    const response = await APIService.uploadFile({
      url: 'upload-multiple',
      formData: formData,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(validFiles.map(() => percent));
      }
    });

    if (response.response && response.response.status >= 400) {
      throw new Error(response.response.data?.message || 'Upload failed');
    }

    setTimeout(() => {
      onUpload && onUpload(response.data);
      setSelectedFiles([]);
      setProgress([]);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#232136] rounded-lg shadow-lg w-full max-w-xl p-0 relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#393053]">
          <span className="text-lg font-semibold text-[#bdbdd7]">
            {selectedFiles.length > 0
              ? `Selected ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`
              : 'Select Files to Upload'}
          </span>
          <button
            className="text-2xl text-[#bdbdd7] hover:text-purple-400 focus:outline-none"
            onClick={uploading ? undefined : onClose}
            aria-label="Close"
            disabled={uploading}
          >
            &times;
          </button>
        </div>

        {/* Error Display */}
        {uploadErrors.length > 0 && (
          <div className="px-6 py-2 bg-red-900/20 border-l-4 border-red-500">
            <div className="text-red-400 text-sm">
              <div className="font-semibold mb-1">Upload Errors:</div>
              {uploadErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-10 px-6 w-full">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg w-60 h-40 cursor-pointer transition-colors mb-6 ${isDragging ? 'border-purple-400 bg-[#2a213a]' : 'border-[#393053]'}`}
            onClick={uploading ? undefined : handleAddFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={uploading ? undefined : handleDrop}
            style={{ pointerEvents: uploading ? 'none' : 'auto' }}
          >
            <span className="text-5xl text-[#393053] mb-2">+</span>
            <span className="text-[#bdbdd7]">Click or drag files/folder here</span>
            <input
              type="file"
              multiple
              webkitdirectory="true"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {/* Files List */}
          {selectedFiles.length > 0 && (
            <div className="w-full mb-4">
              <div className="rounded bg-[#18122B] border border-[#393053] overflow-hidden">
                <div className="flex px-4 py-2 text-xs text-[#bdbdd7] font-bold border-b border-[#393053]">
                  <div className="w-10"></div>
                  <div className="flex-1">Name</div>
                  <div className="w-32 text-right">Size</div>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-[#393053]">
                  {Object.entries(filesByFolder).map(([folder, files], i) => (
                    <React.Fragment key={folder || i}>
                      {folder && (
                        <div className="flex items-center px-4 py-2 bg-[#232136]">
                          <div className="w-10 flex items-center justify-center"><FaFolder className="text-yellow-400" /></div>
                          <div className="flex-1 font-semibold text-[#f3f3f7]">{folder}</div>
                          <div className="w-32 text-right text-xs text-[#bdbdd7]">{files.length} file{files.length > 1 ? 's' : ''}</div>
                        </div>
                      )}
                      {files.filter(file => file != null).map((file, idx) => (
                        <div key={`${file.name}-${file.size}-${idx}`} className="flex items-center px-4 py-2 bg-[#22203a]">
                          <div className="w-10 flex items-center justify-center">{getFileIcon(file)}</div>
                          <div className="flex-1 truncate text-[#f3f3f7]">{file.name || 'Unknown file'}</div>
                          <div className="w-32 text-right text-xs text-[#bdbdd7]">{((file.size || 0) / 1024).toFixed(2)} KB</div>
                          <div className="w-40 ml-4">
                            <div className="h-2 bg-[#393053] rounded-full overflow-hidden">
                              <div
                                className="bg-purple-400 h-2 rounded-full transition-all"
                                style={{ width: `${progress[selectedFiles.indexOf(file)] || 0}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-right text-[#bdbdd7] mt-1">
                              {progress[selectedFiles.indexOf(file)] ? `${progress[selectedFiles.indexOf(file)]}%` : uploading ? '0%' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-[#393053] bg-[#232136]">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors text-sm"
              onClick={handleAddFile}
              disabled={uploading}
            >
              Add file
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-1 rounded bg-[#393053] text-[#bdbdd7] hover:bg-purple-400 hover:text-white transition-colors text-sm"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-1 rounded font-bold transition-colors text-sm ${selectedFiles.length === 0 || uploading ? 'bg-purple-400/50 text-white cursor-not-allowed' : 'bg-purple-400 text-[#18122B] hover:bg-purple-600 hover:text-white'}`}
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
