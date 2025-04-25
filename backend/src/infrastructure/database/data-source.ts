import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()

const { DB_HOST, DB_PORT, DB_USER, DB_USER_PASSWORD, DB_NAME, DB_SCHEMA, NODE_ENV } =
    process.env;

export const DB = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT as string),
    username: DB_USER,
    password: DB_USER_PASSWORD,
    database: DB_NAME,
    schema: DB_SCHEMA,

    connectTimeoutMS: 10000,

    synchronize: NODE_ENV !== "development",
    logging: NODE_ENV == "development",
    entities: ["./src/domain/entities/*.ts"],
    migrations: [__dirname + "/infrastructure/database/migrations/*.ts"],
    subscribers: [],
})