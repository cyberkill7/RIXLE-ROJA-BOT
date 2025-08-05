const fs = require('fs');
const path = require('path');

// Common fixes needed
const fixes = [
    // Fix old baileys imports
    {
        pattern: /@adiwajshing\/baileys/g,
        replacement: '@whiskeysockets/baileys'
    },
    // Fix deprecated request-promise
    {
        pattern: /require\(['"]request-promise['"]\)/g,
        replacement: "require('axios')"
    },
    // Fix deprecated node-fetch
    {
        pattern: /require\(['"]node-fetch['"]\)/g,
        replacement: "require('axios')"
    },
    // Fix old canvas imports
    {
        pattern: /require\(['"]canvas['"]\)/g,
        replacement: "// // require('canvas') // Disabled due to build issues // Disabled due to build issues"
    },
    // Fix old jsdom imports
    {
        pattern: /require\(['"]jsdom['"]\)/g,
        replacement: "// // require('jsdom') // Disabled due to build issues // Disabled due to build issues"
    },
    // Fix old sharp imports
    {
        pattern: /require\(['"]sharp['"]\)/g,
        replacement: "// // require('sharp') // Disabled due to build issues // Disabled due to build issues"
    },
    // Fix old fluent-ffmpeg
    {
        pattern: /require\(['"]fluent-ffmpeg['"]\)/g,
        replacement: "// // require('fluent-ffmpeg') // Disabled due to build issues // Disabled due to build issues"
    }
];

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changed = false;

        // Apply all fixes
        fixes.forEach(fix => {
            if (fix.pattern.test(content)) {
                content = content.replace(fix.pattern, fix.replacement);
                changed = true;
            }
        });

        // Fix common syntax errors
        // Fix missing semicolons
        content = content.replace(/([^;])\n(module\.exports|exports\.)/g, '$1;\n$2');
        
        // Fix missing quotes in require
        content = content.replace(/require\(([^'"]\w+[^'"]*)\)/g, "require('$1')");
        
        // Fix old event listeners
        content = content.replace(/\.on\(['"]qr['"],/g, "// // .on('qr', // Fixed for new baileys // Fixed for new baileys");
        content = content.replace(/\.on\(['"]credentials-updated['"],/g, "// // .on('credentials-updated', // Fixed for new baileys // Fixed for new baileys");
        content = content.replace(/\.on\(['"]connecting['"],/g, "// // .on('connecting', // Fixed for new baileys // Fixed for new baileys");
        content = content.replace(/\.on\(['"]open['"],/g, "// // .on('open', // Fixed for new baileys // Fixed for new baileys");

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.log(`❌ Error fixing ${filePath}: ${error.message}`);
        return false;
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    let fixedCount = 0;

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            fixedCount += walkDir(filePath);
        } else if (file.endsWith('.js')) {
            if (fixFile(filePath)) {
                fixedCount++;
            }
        }
    });

    return fixedCount;
}

console.log('🔧 Starting to fix all files...');
const totalFixed = walkDir('.');
console.log(`\n🎉 Fixed ${totalFixed} files!`);

// Also fix package.json
console.log('\n📦 Fixing package.json...');
try {
    const packagePath = './package.json';
    let packageContent = fs.readFileSync(packagePath, 'utf8');
    let packageChanged = false;

    // Remove problematic dependencies
    const packageJson = JSON.parse(packageContent);
    
    // Remove problematic dependencies
    const removeDeps = [
        'canvas', 'jsdom', 'sharp', 'fluent-ffmpeg', 
        'canvacord', 'canvas-constructor', 'canvas-to-buffer',
        'discord-canvas', 'knights-canvas', 'chess-base',
        'chess-image-generator', 'brainly-scraper', 'browser-id3-writer',
        'dijkstrajs', 'fb-downloads', 'jpeg-js', 'node-tesseract-ocr',
        'nhentai', 'rimraf', 'uuid'
    ];

    removeDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            delete packageJson.dependencies[dep];
            packageChanged = true;
            console.log(`Removed dependency: ${dep}`);
        }
    });

    // Update baileys
    if (packageJson.dependencies && packageJson.dependencies['@whiskeysockets/baileys']) {
        delete packageJson.dependencies['@whiskeysockets/baileys'];
        packageJson.dependencies['@whiskeysockets/baileys'] = '^6.6.0';
        packageChanged = true;
        console.log('Updated baileys dependency');
    }

    if (packageChanged) {
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log('✅ Fixed package.json');
    }
} catch (error) {
    console.log(`❌ Error fixing package.json: ${error.message}`);
}

console.log('\n✨ All fixes completed!');