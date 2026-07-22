import userRepository from "./user.repository.js";

class UserService {
    getAllUsers = async () => {
        // Fetch all users from the database
        const result = await userRepository.getAllUsers();
        return result;
    }
}

export default new UserService();