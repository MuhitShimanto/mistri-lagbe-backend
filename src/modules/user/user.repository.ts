import prisma from "../../config/db.js";

class UserRepository {

    async getAllUsers() {
        // Fetch all users from the database
        const result = await prisma.user.findMany();
        return result;
    }

}
export default new UserRepository();