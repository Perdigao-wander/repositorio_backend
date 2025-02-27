const readline = require('readline-sync');
const { execSync } = require('child_process');

const name = readline.question("Digite o nome da nova migration: ");
execSync(`yarn typeorm migration:create src/migrations/${name}`, { stdio: 'inherit' });
