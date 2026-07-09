import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

const validateRequest =
  <T>(schema: ZodType<T>) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      req.validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user,
        cookies: req.cookies,
      });

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;