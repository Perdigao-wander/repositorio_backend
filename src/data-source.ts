import "dotenv/config";
import 'reflect-metadata';
import {DataSource, DataSourceOptions} from "typeorm"
import { SeederOptions } from 'typeorm-extension';
import {MainSeeder} from "./seeds/MainSeeder";

const port = Number(process.env.DB_REMOTE_PORT) as number | undefined;

const configRemoteConnection: DataSourceOptions & SeederOptions  = {
    type: "postgres",
    host: process.env.DB_REMOTE_HOST,
    port,
    username: process.env.DB_REMOTE_USER,
    password: process.env.DB_REMOTE_PWA,
    synchronize: false,
    logging: false,
    database: process.env.DB_REMOTE_NAME,
    entities: [`${__dirname}/**/entities/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    seeds: [MainSeeder],
    ssl: {
        rejectUnauthorized: false,
    },
}

const configLocalConnection: DataSourceOptions & SeederOptions  =  {
    type: "postgres",
    host: process.env.DB_HOST,
    port,
    username: process.env.DB_USER,
    password: process.env.DB_PWA,
    synchronize: false,
    logging: false,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/**/entities/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    seeds: [MainSeeder],
    ssl: {
        rejectUnauthorized: false,
    },
}

const options: DataSourceOptions & SeederOptions = configLocalConnection;

export const AppDataSource = new DataSource(options)