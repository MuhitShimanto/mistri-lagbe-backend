import type { User } from "../../generated/prisma/client.js";
import type { UserStatus } from "../../generated/prisma/enums.js";
import userRepository from "./user.repository.js";

class UserService {
    getAllUsers = async () => {
        // Fetch all users from the database
        const result = await userRepository.getAllUsers();
        return result;
    }
    updateUser = async (id: string, userData: Partial<User>) => {
        const result = await userRepository.updateUser(id, userData);
        return result;
    }
    updateUserStatus = async (id: string, status: UserStatus) => {
        // Update user status in the database
        const result = await userRepository.updateUserStatus(id, status);
        return result;
    }
}

export default new UserService();