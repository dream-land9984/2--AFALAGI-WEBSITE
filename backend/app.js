/**
 * cPanel Phusion Passenger Startup Entrypoint
 *
 * In cPanel "Setup Node.js App":
 * - Set "Application startup file" to: app.js
 */

const path = require('path');
const fs = require('fs');

// Load environment variables from .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Determine compiled entry point
const mainPathSrc = path.join(__dirname, 'dist', 'src', 'main.js');
const mainPathRoot = path.join(__dirname, 'dist', 'main.js');

if (fs.existsSync(mainPathSrc)) {
  require(mainPathSrc);
} else if (fs.existsSync(mainPathRoot)) {
  require(mainPathRoot);
} else {
  console.error('Error: compiled output not found in dist/. Please run `npm run build` first.');
  process.exit(1);
}
