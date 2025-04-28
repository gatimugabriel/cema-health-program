import { DataSource } from "typeorm";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_SCHEMA,
    NODE_ENV
} = process.env;

const isLocalConnection = DB_HOST === "localhost" || DB_HOST === "127.0.0.1";

// SSL settings
let sslConfig: boolean | object = false;

if (!isLocalConnection) {
    const caPath = path.resolve(__dirname, "../database/ca.pem");

    try {
        if (fs.existsSync(caPath)) {
            // console.log("CA certificate found at:", caPath);
            const ca = fs.readFileSync(caPath).toString();
            sslConfig = {
                rejectUnauthorized: true,
                ca: ca
            };
        } else {
            console.log("CA certificate not found at:", caPath);
            // fallback without CA certificate
            sslConfig = {
                rejectUnauthorized: false
            };
        }
    } catch (error) {
        console.error("Error reading CA certificate:", error);
        sslConfig = {
            rejectUnauthorized: false
        };
    }
}

const connectionUrl = process.env.DATABASE_URL ||
    `postgres://${DB_USER}:${encodeURIComponent(DB_PASSWORD || '')}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const DB = new DataSource({
    type: "postgres",
    url: connectionUrl,
    ssl: sslConfig,

    connectTimeoutMS: 10000,
    // synchronize: NODE_ENV === "development",
    synchronize: true,
    logging: NODE_ENV === "development",
    entities: ["./src/domain/entities/*.ts"],
    migrations: [__dirname + "/migrations/*.ts"],
    subscribers: [],
});