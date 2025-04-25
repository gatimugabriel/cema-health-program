import { Express, Router } from 'express'
import programRoutes from "./programRoutes";

const routes = (app: Express, base_api: string) => {
    const router = Router()

    router.use('/program', programRoutes)

    app.use(`${base_api}`, router)
}

export default routes
