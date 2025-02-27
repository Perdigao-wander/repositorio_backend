"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = require("fs");
require("dotenv/config");
var path = require("path");
var cron = require('node-cron');
function getDatabaseCredentials() {
    var host = process.env.DB_REMOTE_HOST;
    var port = Number(process.env.DB_REMOTE_PORT);
    var dbName = process.env.DB_REMOTE_NAME;
    var user = process.env.DB_REMOTE_USER;
    var password = process.env.DB_REMOTE_PWA;
    return { host: host, port: port, dbName: dbName, user: user, password: password };
}
function createBackup() {
    var _a = getDatabaseCredentials(), host = _a.host, port = _a.port, dbName = _a.dbName, user = _a.user, password = _a.password;
    var timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    var backupDir = path.join(__dirname, "backups");
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    var backupFile = path.join(backupDir, "".concat(dbName, "_backup_").concat(timestamp, ".sql"));
    // const command = PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${user} -f "${backupFile}" ${dbName};
    // backup de dados apenas
    var command = "PGPASSWORD=\"".concat(password, "\" pg_dump -h ").concat(host, " -p ").concat(port, " -U ").concat(user, " --data-only -f \"").concat(backupFile, "\" ").concat(dbName);
    console.log("\n🔄 Criando backup...");
    (0, child_process_1.exec)(command, function (error, stdout, stderr) {
        if (error) {
            console.error("❌ Erro ao criar backup:", stderr);
            return;
        }
        console.log("\u2705 Backup conclu\u00EDdo: ".concat(backupFile));
    });
}
cron.schedule("0 7,12,18 * * *", createBackup, {
    timezone: "Africa/Sao_Tome"
});
console.log("Backup agendado para 07:00, 12:30 e 18:30 (UTC).");
createBackup();
