import {DataSource} from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const {DB_HOST, DB_PORT, DB_USER, DB_USER_PASSWORD} = process.env;

export const TestDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT as string),
    username: DB_USER,
    password: DB_USER_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    schema: `${process.env.DB_SCHEMA}`,

    synchronize: true,
    dropSchema: true,  //clean up after each test suite
    logging: false,

    entities: ['./src/domain/entities/*.ts'],
    migrations: [],
    subscribers: []
});