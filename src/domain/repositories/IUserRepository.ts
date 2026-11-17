import type { User, UpdateUserDTO } from '../entities';

export interface IUserRepository {
  /**
   * Get user by ID
   */
  getUserById(userId: string): Promise<User | null>;

  /**
   * Update user profile
   */
  updateUser(userId: string, data: UpdateUserDTO): Promise<User>;

  /**
   * Delete user account
   */
  deleteUser(userId: string): Promise<void>;
}