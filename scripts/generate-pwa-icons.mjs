import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, '../public/assets/logo/logo.png');
const outputDir = path.join(__dirname, '../public/assets/logo');

async function generateIcons() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `logo-${size}x${size}.png`);
      
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${size}x${size} icon`);
    }

    console.log('🎉 All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons(); 