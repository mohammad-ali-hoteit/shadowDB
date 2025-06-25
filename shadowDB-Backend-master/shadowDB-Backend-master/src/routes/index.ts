import { Application } from "express";
import companyRoutes from "./v1/company.routes";
import userRoutes from "./v1/user.routes";
import authRoutes from "./v1/auth.routes";
import { BASE_ROUTE } from "../constants/routesConstants";

export default function configureRoutes(app: Application) {
    routesV1(app);
}

function routesV1(app: Application) {
    app.use(`${BASE_ROUTE.BASE_URL}${BASE_ROUTE.VERSION_ONE}${BASE_ROUTE.BASE_AUTH}`, authRoutes);
    app.use(`${BASE_ROUTE.BASE_URL}${BASE_ROUTE.VERSION_ONE}${BASE_ROUTE.BASE_COMPANY}`, companyRoutes);
    app.use(`${BASE_ROUTE.BASE_URL}${BASE_ROUTE.VERSION_ONE}${BASE_ROUTE.BASE_USER}`, userRoutes);
    console.log(`${BASE_ROUTE.BASE_URL}${BASE_ROUTE.VERSION_ONE}${BASE_ROUTE.BASE_AUTH}`);
}
