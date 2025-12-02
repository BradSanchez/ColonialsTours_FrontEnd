import React, { useState, useEffect } from 'react';
import { Upload, X, Image } from 'react-feather';

const ImageUpload = ({ onImageUpload, currentImage, className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    // Preview inmediato
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'tours_upload');
      formData.append('folder', 'profiles');
      
      const response = await fetch('https://api.cloudinary.com/v1_1/drxaxh9cr/image/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUpload(data.secure_url);
        // Limpiar URL temporal
        URL.revokeObjectURL(tempUrl);
      } else {
        throw new Error('Error en la respuesta de Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            ) : (
              <>
                <Image className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra una imagen
                </p>
                <p className="text-xs text-gray-500">PNG, JPG o JPEG</p>
              </>
            )}
          </div>
          <input 
            id="profile-image-input"
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;