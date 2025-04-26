/**
 * Global Mocks
 * I initialize & destroy the database connection before and after tests respectively
 * */

import {TestDataSource} from "../src/infrastructure/database/test/data-source";

beforeAll(async () => {
    try {
        await TestDataSource.initialize();
        console.log('Test database initialized');
    } catch (e) {
        console.error("Error initializing test database: ", e)
        throw e;
    }

});

afterAll(async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy()
        console.log('Closed test database connection!');
    }
});

// beforeEach(async () => {
//     if (TestDataSource.isInitialized) {
//         const entities = TestDataSource.entityMetadatas;
//
//         for (const entity of entities) {
//             // const repository = TestDataSource.getRepository(entity.name);
//             // await repository.clear();
//             await TestDataSource.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
//         }
//     }
// });