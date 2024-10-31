import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import CONFIG from "./src/config/server_config";
import apiRouter from "./src/routes";

const app: Application = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// API routes
app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(CONFIG.PORT, async () => {
  console.log(`Server started on port ${CONFIG.PORT}`);
});
