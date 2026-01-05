const sharp = require('sharp');
const path = require('path');

const inputFile = path.join(__dirname, '../public/favicon.png');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
    console.log('Generating favicon files...');

    try {
        // Generate 32x32 favicon.ico (PNG, will work as favicon)
        await sharp(inputFile)
            .resize(32, 32)
            .png()
            .toFile(path.join(publicDir, 'favicon.ico'));
        console.log('✓ Generated favicon.ico (32x32)');

        // Generate 192x192 for PWA/Android
        await sharp(inputFile)
            .resize(192, 192)
            .png()
            .toFile(path.join(publicDir, 'icon-192.png'));
        console.log('✓ Generated icon-192.png');

        // Generate 512x512 for PWA/Android
        await sharp(inputFile)
            .resize(512, 512)
            .png()
            .toFile(path.join(publicDir, 'icon-512.png'));
        console.log('✓ Generated icon-512.png');

        // Generate 180x180 Apple touch icon
        await sharp(inputFile)
            .resize(180, 180)
            .png()
            .toFile(path.join(publicDir, 'apple-icon.png'));
        console.log('✓ Generated apple-icon.png');

        console.log('\n✅ All favicon files generated successfully!');
    } catch (error) {
        console.error('Error generating favicons:', error);
        process.exit(1);
    }
}

generateFavicons();
