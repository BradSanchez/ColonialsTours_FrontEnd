// Alternativa con base64 si Cloudinary no funciona
const handleFileSelect = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const remainingSlots = 4 - images.length;
  if (remainingSlots <= 0) {
    alert('Máximo 4 imágenes permitidas por tour');
    return;
  }

  const filesToProcess = files.slice(0, remainingSlots);
  setUploading(true);
  const newImages = [];

  for (const file of filesToProcess) {
    if (file.type.startsWith('image/')) {
      // Convertir a base64 comprimido
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      await new Promise((resolve) => {
        img.onload = () => {
          // Redimensionar a máximo 800x600
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          newImages.push(compressedBase64);
          resolve();
        };
        img.src = URL.createObjectURL(file);
      });
    }
  }

  const updatedImages = [...images, ...newImages];
  setImages(updatedImages);
  onImagesChange(updatedImages);
  setUploading(false);
};