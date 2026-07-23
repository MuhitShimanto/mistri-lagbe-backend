import type { Request, Response, NextFunction } from 'express';
import path from 'path';

class DocsController {
  apiDocs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Return the html content of the API documentation
      const filePath = path.join(process.cwd(), 'src', 'modules', 'docs', 'api-docs.html');
      return res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  };
}
export default new DocsController();
