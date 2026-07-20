import type {NextFunction, Request, Response} from "express";
import reviewService from "./review.service.js";
import type { User } from "../../generated/prisma/client.js";

class ReviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as User;
            const result = await reviewService.createReview(req.body, user);
            res.status(201).json({
                status: "success",
                message: "Review created successfully",
                data: result,
            })
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();