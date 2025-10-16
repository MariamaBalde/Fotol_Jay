import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('🔍 Debug Cloudinary config:');
console.log('CLOUD_NAME:', cloudName ? 'SET' : 'NOT SET');
console.log('API_KEY:', apiKey ? 'SET' : 'NOT SET');
console.log('API_SECRET:', apiSecret ? 'SET' : 'NOT SET');

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Configuration Cloudinary incomplète!');
  console.error('Variables manquantes:', {
    cloudName: !!cloudName,
    apiKey: !!apiKey,
    apiSecret: !!apiSecret
  });
  throw new Error('Configuration Cloudinary manquante');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

console.log('✅ Configuration Cloudinary chargée avec succès');

export default cloudinary;