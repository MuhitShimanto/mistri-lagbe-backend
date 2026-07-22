import type {Request, Response, NextFunction} from "express";

class DocsController {
    apiDocs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Return the html content of the API documentation
            return res.sendFile("api-docs.html", { root: "src/modules/docs" });
        } catch (error) {
            next(error);
        }
    }
}
export default new DocsController();