import imageCompression from "browser-image-compression";

/**
 * Compresses an array of images or a single image file.
 * @param {File | File[]} files - The file(s) to compress.
 * @returns {Promise<File[]>} - A promise that resolves to an array of compressed files.
 */
export const compressImages = async (files) => {
  const fileArray = Array.isArray(files) ? files : [files];
  
  const options = {
    maxSizeMB: 1,            // Target max size 1MB (keeps quality high for real estate)
    maxWidthOrHeight: 1920,  // Max dimension 1920px (1080p/2K standard)
    useWebWorker: true,      // Use background thread for speed
    fileType: "image/webp",  // Convert to WebP for best compression/quality ratio
    initialQuality: 0.85,    // 85% quality is visually lossless for web
  };

  console.log(`[Compression] Starting compression for ${fileArray.length} images...`);

  try {
    const compressedFiles = await Promise.all(
      fileArray.map(async (file, index) => {
        console.log(`[Compression] Optimizing image ${index + 1}: ${file.name} (Original: ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        
        const compressedFile = await imageCompression(file, options);
        
        console.log(`[Compression] Finished ${file.name} (Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB)`);
        
        // Return a new File object with the correct extension if it was converted to webp
        return new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
          type: "image/webp",
        });
      })
    );

    console.log("[Compression] All images compressed successfully.");
    return compressedFiles;
  } catch (error) {
    console.error("[Compression] Error during image compression:", error);
    // Return original files if compression fails to avoid blocking the user
    return fileArray;
  }
};
