import type { IUserRepository } from '../../domain/repositories';
import type { User, UpdateUserDTO } from '../../domain/entities';
import { FirebaseUserDataSource } from '../datasources/firebase/FirebaseUserDataSource';

export class UserRepositoryImpl implements IUserRepository {
  private dataSource = new FirebaseUserDataSource();

  async getUserById(userId: string): Promise<User | null> {
    return this.dataSource.getUserById(userId);
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<User> {
    return this.dataSource.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.dataSource.deleteUser(userId);
  }
}