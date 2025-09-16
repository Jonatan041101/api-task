import { IUserRepository } from "../repository/user.repository.interface";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}
  getCurrentUser(email: string) {
    return this.userRepository.getCurrentUser(email);
  }
}
