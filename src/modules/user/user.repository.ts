import prisma from "../../config/db.js";
import type { UserStatus } from "../../generated/prisma/enums.js";

class UserRepository {

    async getAllUsers() {
        // Fetch all users from the database
        const result = await prisma.user.findMany();
        return result;
    }
    async updateUserStatus(id: string, status: UserStatus) {
        // Update user status in the database
        const result = await prisma.user.update({
            where: { id },
            data: { status },
        });
        return result;
    }

}
export default new UserRepository();