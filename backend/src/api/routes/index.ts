import { Express, Router } from 'express'
import programRoutes from "./programRoutes";
import clientRoutes from "./clientRoutes";
import enrollmentRoutes from "./enrollmentRoutes";
import authRoutes from "./auth.routes";

const routes = (app: Express, base_api: string) => {
    const router = Router()

    router.use('/auth', authRoutes)
    router.use('/program', programRoutes)
    router.use('/client', clientRoutes)
    router.use('/enrollment', enrollmentRoutes)

    app.use(`${base_api}`, router)
}

export default routes

