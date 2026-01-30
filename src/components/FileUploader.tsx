import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}

export default function FileUploader({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-4 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
        isDragging
          ? 'border-neon-green bg-neon-green/10 shadow-neon-green-lg'
          : 'border-neon-green/30 bg-gray-900/50 hover:border-neon-green/60 hover:bg-gray-900/70'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="video/*,image/*"
        onChange={handleFileInput}
      />

      <motion.div
        animate={{
          y: isDragging ? -10 : 0,
          scale: isDragging ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Upload className="w-20 h-20 mx-auto mb-6 text-neon-green" />
      </motion.div>
      <h3 className="text-2xl font-cyber font-bold text-white mb-3">
        Drop your file here
      </h3>
      <p className="text-gray-400 font-cyber mb-4">
        or click to browse
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleButtonClick}
        className="px-8 py-3 bg-neon-green text-cyber-navy font-cyber font-bold rounded-lg shadow-neon-green hover:shadow-neon-green-lg transition-all duration-300"
      >
        SELECT FILE
      </motion.button>
      <p className="text-xs text-gray-500 font-cyber mt-4">
        Supports: MP4, AVI, MOV, JPG, PNG
      </p>
    </motion.div>
  );
}
