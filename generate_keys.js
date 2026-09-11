const crypto = require('crypto');
const fs = require('fs');

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret)
    .update(encodedHeader + "." + encodedPayload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const jwtSecret = crypto.randomBytes(32).toString('hex');
const anonPayload = { role: "anon", iss: "supabase", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) };
const servicePayload = { role: "service_role", iss: "supabase", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) };

const anonKey = generateJWT(anonPayload, jwtSecret);
const serviceRoleKey = generateJWT(servicePayload, jwtSecret);
const postgresPassword = crypto.randomBytes(24).toString('hex');
const dashboardPassword = crypto.randomBytes(16).toString('hex');

let envTemplate = fs.readFileSync('.env.supabase.example', 'utf-8');

envTemplate = envTemplate.replace(/POSTGRES_PASSWORD=.*/, `POSTGRES_PASSWORD=${postgresPassword}`);
envTemplate = envTemplate.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
envTemplate = envTemplate.replace(/ANON_KEY=.*/, `ANON_KEY=${anonKey}`);
envTemplate = envTemplate.replace(/SERVICE_ROLE_KEY=.*/, `SERVICE_ROLE_KEY=${serviceRoleKey}`);
envTemplate = envTemplate.replace(/DASHBOARD_PASSWORD=.*/, `DASHBOARD_PASSWORD=${dashboardPassword}`);
envTemplate = envTemplate.replace(/SITE_URL=.*/, `SITE_URL=http://localhost:3000`);

fs.writeFileSync('.env.supabase.local', envTemplate);

console.log("Postgres:", postgresPassword);
console.log("JWT:", jwtSecret);
console.log("Anon:", anonKey);
console.log("Service:", serviceRoleKey);
