import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw, Crop, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PremiumPhotoUploadProps {
  currentAvatar?: string;
  onPhotoChange: (photoData: string) => void;
  isUploading?: boolean;
}

export default function PremiumPhotoUpload({ 
  currentAvatar, 
  onPhotoChange, 
  isUploading = false 
}: PremiumPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const cropImage = useCallback((imageData: string, cropSize: number = 300) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = cropSize;
        canvas.height = cropSize;
        
        // Calculate crop dimensions (center crop to square)
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        
        // Draw cropped and resized image
        ctx.drawImage(img, x, y, size, size, 0, 0, cropSize, cropSize);
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageData;
    });
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!originalImage) return;
    
    try {
      const croppedImage = await cropImage(originalImage);
      setPreview(croppedImage);
      onPhotoChange(croppedImage);
      setShowCropModal(false);
      toast.success('Photo updated successfully!');
    } catch (error) {
      toast.error('Failed to process image');
    }
  }, [originalImage, cropImage, onPhotoChange]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    onPhotoChange('');
    toast.success('Photo removed');
  }, [onPhotoChange]);

  const resetToOriginal = useCallback(() => {
    setPreview(currentAvatar || null);
    onPhotoChange(currentAvatar || '');
  }, [currentAvatar, onPhotoChange]);

  return (
    <>
      <div className="relative">
        {/* Main Upload Area */}
        <div
          className={`relative group cursor-pointer transition-all duration-500 ${
            isDragging ? 'scale-105' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Avatar Display */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            
            {/* Main Avatar Container */}
            <div className={`relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500 ${
              isDragging 
                ? 'border-blue-400 shadow-lg shadow-blue-400/50' 
                : 'border-white/30 group-hover:border-blue-400/70'
            }`}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              )}
              
              {/* Upload Overlay */}
              <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                isUploading ? 'opacity-100' : ''
              }`}>
                {isUploading ? (
                  <div className="animate-spin">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                ) : (
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
            </div>

            {/* Premium Badge */}
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1 sm:p-1.5 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              {preview ? 'Tap to change photo' : 'Tap or drag to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2 mt-3 sm:mt-4"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                removePhoto();
              }}
              className="touch-target p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
            
            {currentAvatar && preview !== currentAvatar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToOriginal();
                }}
                className="touch-target p-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg transition-colors"
                title="Reset to original"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </motion.div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />
      </div>

      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && originalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Crop Your Photo</h3>
                <p className="text-gray-400 text-sm">
                  Your photo will be cropped to a square and resized for optimal display
                </p>
              </div>

              {/* Preview */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-500/50">
                  <img
                    src={originalImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 border-2 border-blue-400 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="flex-1 touch-target px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 touch-target px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Crop className="w-4 h-4" />
                  Crop & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}