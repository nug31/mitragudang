const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function heading(message) {
  log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${message}${colors.reset}`);
  log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  heading('🚀 Gudang Mitra - Railway Connection Setup');
  
  info('Script ini akan membantu Anda menghubungkan frontend dengan backend Railway');
  console.log('');
  
  // Step 1: Check Railway backend URL
  heading('Step 1: Verifikasi Backend Railway');
  
  console.log('Silakan buka Railway dashboard Anda:');
  info('1. Buka https://railway.app/dashboard');
  info('2. Pilih project "gudangmitra-production" atau project backend Anda');
  info('3. Klik pada service backend');
  info('4. Di tab "Settings", cari bagian "Domains"');
  info('5. Copy URL domain yang tersedia (contoh: gudangmitra-production.up.railway.app)');
  console.log('');
  
  const backendUrl = await question('Masukkan URL backend Railway Anda (tanpa https://): ');
  
  if (!backendUrl || backendUrl.trim() === '') {
    error('URL backend tidak boleh kosong!');
    rl.close();
    return;
  }
  
  const fullBackendUrl = `https://${backendUrl.replace('https://', '').replace('http://', '')}`;
  
  success(`Backend URL: ${fullBackendUrl}`);
  
  // Step 2: Test backend connection
  heading('Step 2: Test Koneksi Backend');
  
  info('Mencoba koneksi ke backend...');
  
  try {
    const testUrl = `${fullBackendUrl}/health`;
    info(`Testing: ${testUrl}`);
    
    const response = execSync(`curl -s "${testUrl}"`, { encoding: 'utf-8' });
    
    if (response.includes('healthy') || response.includes('ok') || response.includes('success')) {
      success('Backend Railway terhubung dengan baik! ✓');
    } else {
      warning('Backend merespons, tapi mungkin belum sepenuhnya siap');
      info(`Response: ${response}`);
    }
  } catch (err) {
    error('Tidak dapat terhubung ke backend Railway');
    warning('Pastikan:');
    info('1. Backend sudah di-deploy di Railway');
    info('2. Domain sudah di-generate di Railway');
    info('3. Environment variables sudah di-set dengan benar');
    console.log('');
    
    const continueAnyway = await question('Lanjutkan update konfigurasi? (y/n): ');
    if (continueAnyway.toLowerCase() !== 'y') {
      error('Setup dibatalkan');
      rl.close();
      return;
    }
  }
  
  // Step 3: Update frontend configuration
  heading('Step 3: Update Konfigurasi Frontend');
  
  // Update .env.production
  const envProductionPath = path.join(__dirname, '.env.production');
  const envContent = `VITE_API_URL=${fullBackendUrl}/api`;
  
  fs.writeFileSync(envProductionPath, envContent);
  success('Updated .env.production');
  
  // Update netlify.toml
  const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
  const netlifyContent = `[build]
  command = "npm ci && npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"
  VITE_API_URL = "${fullBackendUrl}/api"
  
# Redirect all routes to index.html for SPA routing  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
  
  fs.writeFileSync(netlifyTomlPath, netlifyContent);
  success('Updated netlify.toml');
  
  // Step 4: Show Railway environment variables
  heading('Step 4: Verifikasi Environment Variables Railway');
  
  console.log('Pastikan environment variables berikut sudah di-set di Railway:');
  console.log('');
  info('DB_HOST=nozomi.proxy.rlwy.net');
  info('DB_PORT=21817');
  info('DB_USER=root');
  info('DB_PASSWORD=pvOcQbzlDAobtcdozbMvCdIDDEmenwkO');
  info('DB_NAME=railway');
  info('DB_SSL=false');
  info('PORT=3002');
  info('NODE_ENV=production');
  info('CORS_ORIGIN=https://gudang-mitra-app.netlify.app');
  console.log('');
  
  const envVarsSet = await question('Apakah semua environment variables sudah di-set? (y/n): ');
  
  if (envVarsSet.toLowerCase() !== 'y') {
    warning('Silakan set environment variables di Railway terlebih dahulu:');
    info('1. Buka Railway dashboard');
    info('2. Pilih service backend Anda');
    info('3. Klik tab "Variables"');
    info('4. Tambahkan semua environment variables di atas');
    info('5. Redeploy service setelah menambahkan variables');
    console.log('');
  }
  
  // Step 5: Build and deploy instructions
  heading('Step 5: Build dan Deploy Frontend');
  
  console.log('Untuk menyelesaikan setup, jalankan perintah berikut:');
  console.log('');
  info('1. Build aplikasi:');
  console.log('   npm run build');
  console.log('');
  info('2. Deploy ke Netlify:');
  console.log('   netlify deploy --prod --dir=dist');
  console.log('');
  
  const autoBuild = await question('Apakah Anda ingin script ini melakukan build dan deploy otomatis? (y/n): ');
  
  if (autoBuild.toLowerCase() === 'y') {
    heading('Building Application...');
    
    try {
      info('Running: npm run build');
      execSync('npm run build', { stdio: 'inherit' });
      success('Build berhasil!');
      
      console.log('');
      const autoDeploy = await question('Deploy ke Netlify sekarang? (y/n): ');
      
      if (autoDeploy.toLowerCase() === 'y') {
        heading('Deploying to Netlify...');
        
        try {
          info('Running: netlify deploy --prod --dir=dist');
          execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
          success('Deploy berhasil!');
        } catch (err) {
          error('Deploy gagal. Silakan deploy manual dengan: netlify deploy --prod --dir=dist');
        }
      }
    } catch (err) {
      error('Build gagal. Silakan cek error di atas.');
    }
  }
  
  // Final summary
  heading('✅ Setup Selesai!');
  
  console.log('Konfigurasi telah diupdate:');
  success(`Backend URL: ${fullBackendUrl}/api`);
  success('Frontend: https://gudang-mitra-app.netlify.app');
  console.log('');
  
  console.log('Langkah selanjutnya:');
  info('1. Pastikan backend Railway sudah running');
  info('2. Test backend: ' + fullBackendUrl + '/health');
  info('3. Test login di: https://gudang-mitra-app.netlify.app');
  info('4. Gunakan akun: manager@gudangmitra.com / password123');
  console.log('');
  
  success('Aplikasi Anda sekarang terhubung dengan Railway database! 🎉');
  
  rl.close();
}

main().catch(err => {
  error('Error: ' + err.message);
  rl.close();
  process.exit(1);
});

