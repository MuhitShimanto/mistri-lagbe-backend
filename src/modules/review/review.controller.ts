import type {NextFunction, Request, Response} from "express";
import reviewService from "./review.service.js";
import type { User } from "../../generated/prisma/client.js";
import ApiError from "../../utils/ApiError.js";

class ReviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as User;
            const {bookingId} = req.params;
            if (!bookingId) {
                throw new ApiError(400, "Service not found for this review.");
            }
            const result = await reviewService.createReview({bookingId, ...req.body}, user);
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