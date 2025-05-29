import cloudinary from '../cloudinary';

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export const uploadImage = async (
  file: File | string, 
  folder: string = 'products'
): Promise<UploadResult> => {
  try {
    let fileData: string;
    
    if (file instanceof File) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`);
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum 5MB allowed.');
      }
      
      // Convert File to base64 string
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const base64 = Buffer.from(bytes).toString('base64');
      fileData = `data:${file.type};base64,${base64}`;
    } else {
      // Validate base64 string
      if (!file.startsWith('data:image/')) {
        throw new Error('Invalid image data format');
      }
      fileData = file;
    }

    console.log('Uploading to Cloudinary...', { folder, fileSize: fileData.length });

    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    console.log('Upload successful:', { public_id: result.public_id, secure_url: result.secure_url });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      throw new Error(`Image upload failed: ${error.message}`);
    } else {
      throw new Error(`Image upload failed: ${JSON.stringify(error)}`);
    }
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted:', { publicId, result });
  } catch (error) {
    console.error('Image deletion error:', error);
    throw new Error(`Image deletion failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }
};

export const uploadMultipleImages = async (
  files: (File | string)[], 
  folder: string = 'products'
): Promise<UploadResult[]> => {
  try {
    console.log(`Starting upload of ${files.length} images...`);
    
    if (!files || files.length === 0) {
      return [];
    }
    
    // Upload images one by one for better error handling
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      console.log(`Uploading image ${i + 1}/${files.length}`);
      try {
        const result = await uploadImage(files[i], folder);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        
        // Clean up already uploaded images
        if (results.length > 0) {
          console.log('Cleaning up uploaded images...');
          await Promise.all(
            results.map(result => deleteImage(result.public_id).catch(() => {}))
          );
        }
        
        throw new Error(`Failed to upload image ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log(`Successfully uploaded ${results.length} images`);
    return results;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw error; // Re-throw the error as is since it's already formatted
  }
};