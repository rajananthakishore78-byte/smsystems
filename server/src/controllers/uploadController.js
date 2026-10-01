import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    if (isCloudinaryConfigured) {
      // Convert buffer to data URI stream for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'cctv_showroom',
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });

      return res.json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully',
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height
      });
    }

    // Fallback: If Cloudinary is not configured yet in .env, create inline data URL or return realistic CDN URL
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    return res.json({
      success: true,
      message: 'Local fallback upload processed (configure CLOUDINARY_CLOUD_NAME in .env for live cloud sync)',
      url: dataURI,
      isLocal: true
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed: ' + error.message
    });
  }
};
