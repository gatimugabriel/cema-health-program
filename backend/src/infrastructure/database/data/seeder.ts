import {DB} from "../data-source";
import {Program} from "../../../domain/entities/Program";
import {dummyPrograms, dummyClients} from "./dummy-data";
import {Client} from "../../../domain/entities/Client";

async function seedPrograms() {
    try {
        await DB.initialize();
        console.log("Database connection established.");

        const programRepository = DB.getRepository(Program);
        const clientRepository = DB.getRepository(Client);

        // const existingPrograms = await programRepository.find();
        // if (existingPrograms.length > 0) {
        //     console.log("Programs already exist. Skipping seeding.");
        //     return;
        // }

        await programRepository.insert(dummyPrograms);
        await clientRepository.insert(dummyClients)
        console.log("data seeded successfully.");
    } catch (error) {
        console.error("Error seeding dummyPrograms:", error);
    } finally {
        await DB.destroy();
    }
}

seedPrograms();
