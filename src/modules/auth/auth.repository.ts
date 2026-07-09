import prisma from "../../config/db.js";

class AuthRepository {
  createUser(data: any) {
    return prisma.user.create({
      data,
    });
  }

  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}

export default new AuthRepository();