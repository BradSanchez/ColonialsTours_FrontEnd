import React, { useState } from 'react';
import { Upload, X, Plus, Image } from 'react-feather';

const MultiImageUpload = ({ onImagesChange, currentImages = [] }) => {
  const [images, setImages] = useState(currentImages);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      alert('Máximo 5 imágenes permitidas por tour');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setUploading(true);
    const newImages = [];

    for (const file of filesToProcess) {
      if (file.type.startsWith('image/')) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'tours_upload');
          
          const response = await fetch('https://api.cloudinary.com/v1_1/drxaxh9cr/image/upload', {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          if (data.secure_url) {
            newImages.push(data.secure_url);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="multi-image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="multi-image-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="text-blue-500" size={24} />
            )}
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              {uploading ? 'Subiendo imágenes...' : 'Seleccionar múltiples imágenes'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, JPEG hasta 5MB cada una
            </p>
          </div>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700">
              Imágenes del Tour ({images.length}/5)
            </h4>
            <p className="text-sm text-gray-500">
              Arrastra para reordenar • Primera imagen será la principal
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-xl overflow-hidden aspect-square"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  moveImage(fromIndex, index);
                }}
              >
                <img
                  src={image}
                  alt={`Tour imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => removeImage(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Principal
                  </div>
                )}

                {/* Position Number */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
            
            {/* Add More Button */}
            {images.length < 5 && (
              <label
                htmlFor="multi-image-upload"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Plus className="text-gray-400" size={24} />
                <span className="text-sm text-gray-500 mt-1">Agregar más</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8">
          <Image className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No hay imágenes seleccionadas</p>
          <p className="text-sm text-gray-400 mt-1">
            Sube múltiples imágenes para crear una galería atractiva
          </p>
        </div>
      )}

      {/* Tips */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h5 className="font-medium text-blue-900 mb-2">💡 Consejos para mejores resultados:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• La primera imagen será la imagen principal del tour</li>
            <li>• Usa imágenes de alta calidad (mínimo 800x600px)</li>
            <li>• Incluye diferentes ángulos y momentos del tour</li>
            <li>• Máximo permitido: 5 imágenes por tour</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;