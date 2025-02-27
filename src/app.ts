import 'express-async-errors';
import express from 'express';
import errorMiddleware from "./middlewares/errorMiddleware";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import ViewRoutes from "./routes/ViewsRoutes";
import DomainRoutes from "./routes/DomainRoutes";
import FileResolveRoute from "./routes/FileResolveRoutes";
import {logOperationsMiddleware} from "./middlewares/logOperationsMiddleware";
import CustomerRoutes from "./routes/ClientRoutes";
import InsuranceRouter from "./routes/InsuranceRoutes";

const app = express();

var cors = require('cors')
var cookieParser = require('cookie-parser')
const upload = require('express-fileupload');

app.use(cookieParser())
app.use(upload());
app.use(cors({
    origin: 'http://localhost:3004',
    credentials: true,
}));
app.use(express.json());
app.use(logOperationsMiddleware);

// Rotas
app.use(AuthRoutes)
app.use(FileResolveRoute)
app.use(InsuranceRouter)
app.use(UserRoutes)
app.use(CustomerRoutes)
app.use(DomainRoutes)
app.use(ViewRoutes)

// middlewares de error
app.use(errorMiddleware);
export default app;