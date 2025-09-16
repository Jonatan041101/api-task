import { IDatabase } from "@/common/base/application/database.interface";
import { IUserRepository } from "../../application/repository/user.repository.interface";

export class UserFirebaseRepository implements IUserRepository{
  private readonly collectionName = "user";
  constructor(private readonly repository: IDatabase) {}

  async getCurrentUser(email: string): Promise<any> {
    const userRef = this.repository.collection(this.collectionName);

    const user = await userRef.where({ email }).get();

    return user;
  }
}
