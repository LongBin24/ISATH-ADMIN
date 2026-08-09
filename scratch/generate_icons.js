const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG Icon representing iStash brand with Navy #003377 background and Gold #FFC83D badge
const createSvgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#003377"/>
  <circle cx="380" cy="130" r="80" fill="#FFC83D" opacity="0.3"/>
  <circle cx="130" cy="380" r="100" fill="#334155" opacity="0.4"/>
  <g transform="translate(106, 106)">
    <!-- Wallet / Stash Icon -->
    <rect x="30" y="70" width="240" height="170" rx="30" fill="none" stroke="#FFC83D" stroke-width="24"/>
    <path d="M 50 70 L 250 70 Q 220 20 150 20 Q 80 20 50 70 Z" fill="#FFC83D"/>
    <circle cx="210" cy="155" r="22" fill="#FFC83D"/>
    <!-- Khmer letter / iStash Monogram -->
    <text x="150" y="270" font-family="'Google Sans', 'Kantumruuy Pro', sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle">iStash</text>
  </g>
</svg>
`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), createSvgIcon(512));
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSvgIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSvgIcon(512));

console.log('SVG icons generated in public/icons');
