const fs = require('fs');
const path = require('path');


const clientPath = path.resolve('./pk_plan-client')
const envPath = path.resolve('./pk_plan-client/.env');
path.resolve('./pk_plan-server');
const tempEnvPath = path.resolve('./pk_plan-client/env');

if (fs.existsSync(envPath))
    fs.renameSync(envPath, tempEnvPath);

require('child_process').execSync(`(cd ${clientPath} && npm run build)`);

if (fs.existsSync(tempEnvPath))
    fs.renameSync(tempEnvPath, envPath);