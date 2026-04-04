const https = require('https');
const fs = require('fs');
const path = require('path');

// Color codes
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

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).on('timeout', () => {
      reject(new Error('Request timeout'));
    });
  });
}

async function checkBackend(backendUrl) {
  heading('Testing Backend Connection');
  
  const endpoints = [
    { path: '/health', name: 'Health Check' },
    { path: '/api/test-connection', name: 'Database Connection' },
    { path: '/api/items', name: 'Items API' },
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    const url = `${backendUrl}${endpoint.path}`;
    info(`Testing: ${endpoint.name}`);
    console.log(`  URL: ${url}`);
    
    try {
      const response = await makeRequest(url);
      
      if (response.statusCode === 200) {
        success(`${endpoint.name} - OK (${response.statusCode})`);
        
        try {
          const json = JSON.parse(response.data);
          console.log(`  Response:`, JSON.stringify(json, null, 2).split('\n').slice(0, 5).join('\n'));
        } catch (e) {
          console.log(`  Response: ${response.data.substring(0, 100)}...`);
        }
      } else {
        warning(`${endpoint.name} - Status ${response.statusCode}`);
        allPassed = false;
      }
    } catch (err) {
      error(`${endpoint.name} - Failed: ${err.message}`);
      allPassed = false;
    }
    
    console.log('');
  }
  
  return allPassed;
}

async function checkConfiguration() {
  heading('Checking Configuration Files');
  
  let configOk = true;
  
  // Check .env.production
  const envPath = path.join(__dirname, '.env.production');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_API_URL=(.+)/);
    
    if (match) {
      const apiUrl = match[1].trim();
      success(`.env.production found`);
      info(`  API URL: ${apiUrl}`);
      return apiUrl;
    } else {
      error('.env.production exists but VITE_API_URL not found');
      configOk = false;
    }
  } else {
    error('.env.production not found');
    configOk = false;
  }
  
  // Check netlify.toml
  const netlifyPath = path.join(__dirname, 'netlify.toml');
  if (fs.existsSync(netlifyPath)) {
    success('netlify.toml found');
    const netlifyContent = fs.readFileSync(netlifyPath, 'utf-8');
    const match = netlifyContent.match(/VITE_API_URL\s*=\s*"(.+)"/);
    
    if (match) {
      info(`  API URL: ${match[1]}`);
    }
  } else {
    warning('netlify.toml not found');
  }
  
  console.log('');
  
  return configOk ? null : false;
}

async function main() {
  heading('🔍 Gudang Mitra - Connection Checker');
  
  info('Checking your application configuration and connectivity...');
  console.log('');
  
  // Check configuration
  const apiUrl = await checkConfiguration();
  
  if (!apiUrl) {
    error('Configuration check failed!');
    console.log('');
    warning('Please run one of these scripts first:');
    info('  - quick-fix-railway.ps1');
    info('  - quick-fix-railway.bat');
    info('  - node connect-to-railway.js');
    return;
  }
  
  // Extract backend URL (remove /api suffix)
  const backendUrl = apiUrl.replace(/\/api$/, '');
  
  // Check backend
  const backendOk = await checkBackend(backendUrl);
  
  // Summary
  heading('📊 Summary');
  
  if (backendOk) {
    success('All checks passed! ✓');
    console.log('');
    info('Your application should be working correctly.');
    console.log('');
    console.log('Next steps:');
    info('1. Open: https://gudang-mitra-app.netlify.app');
    info('2. Login with: manager@gudangmitra.com / password123');
    info('3. Check if dashboard shows real data');
  } else {
    error('Some checks failed!');
    console.log('');
    warning('Possible issues:');
    info('1. Backend Railway might not be deployed yet');
    info('2. Environment variables might not be set correctly');
    info('3. Database connection might be failing');
    console.log('');
    console.log('Troubleshooting:');
    info('1. Check Railway deployment logs');
    info('2. Verify all environment variables are set');
    info('3. Make sure root directory is set to "server"');
    info('4. Wait a few minutes after deployment');
  }
  
  console.log('');
  heading('🔗 Useful Links');
  console.log('');
  info(`Frontend: https://gudang-mitra-app.netlify.app`);
  info(`Backend: ${backendUrl}`);
  info(`Railway Dashboard: https://railway.app/dashboard`);
  info(`Netlify Dashboard: https://app.netlify.com`);
  console.log('');
}

main().catch(err => {
  error('Error: ' + err.message);
  process.exit(1);
});

