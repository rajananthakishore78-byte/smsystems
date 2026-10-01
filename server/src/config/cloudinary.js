import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isCloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary initialized successfully for CCTV image storage.');
} else {
  console.log('ℹ️ Cloudinary credentials not fully specified - direct image URLs & placeholder uploads enabled.');
}

export { cloudinary, isCloudinaryConfigured };
