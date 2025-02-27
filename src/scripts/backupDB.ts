import { exec } from "child_process";
import * as fs from "fs";
import "dotenv/config";
import * as path from "path";
var cron = require('node-cron');

function getDatabaseCredentials() {
    const host = process.env.DB_REMOTE_HOST
    const port = Number(process.env.DB_REMOTE_PORT) as number;
    const dbName = process.env.DB_REMOTE_NAME;
    const user = process.env.DB_REMOTE_USER;
    const password = process.env.DB_REMOTE_PWA;

    return { host, port, dbName, user, password };
}

function createBackup() {
    const { host, port, dbName, user, password } = getDatabaseCredentials();


    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const backupDir = path.join(__dirname, "backups");
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    const backupFile = path.join(backupDir, `${dbName}_backup_${timestamp}.sql`);

    // const command = PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${user} -f "${backupFile}" ${dbName};

    // backup de dados apenas
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${user} --data-only -f "${backupFile}" ${dbName}`;

    console.log("\n🔄 Criando backup...");

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Erro ao criar backup:", stderr);
            return;
        }
        console.log(`✅ Backup concluído: ${backupFile}`);
    });
}


cron.schedule("0 7,12,18 * * *", createBackup, {
    timezone: "Africa/Sao_Tome"
});

console.log("Backup agendado para 07:00, 12:30 e 18:30 (UTC).");

createBackup();
