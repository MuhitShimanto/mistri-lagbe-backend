import { Router } from "express";
import docsController from "./docs.controller.js";

const DocsRouter = Router();

DocsRouter.get("/", docsController.apiDocs);

export default DocsRouter;