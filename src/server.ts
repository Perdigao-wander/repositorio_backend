process.on('uncaughtException', function (e) {
    console.error(e)
});
process.on('uncaughtExceptionMonitor', function (e) {
    console.error(e)
});
process.on('unhandledRejection', function (e) {
    console.error(e)
});
import app from './app';
import {AppDataSource} from "./data-source";

AppDataSource.initialize().then(() => {
    console.log('Database connection successful!\n');
    console.log('Starting Server NICON BACKEND........');

    let port = Number(process.env.SERVER_PORT) || 3003;
    let host = process.env.SERVER_HOST || 'localhost';

    app.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
}).catch((error) => {
    console.error(`Database initialize error: ${error}`);
});