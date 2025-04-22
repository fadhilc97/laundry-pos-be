import express, { Express, json, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api/v1", routes);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
