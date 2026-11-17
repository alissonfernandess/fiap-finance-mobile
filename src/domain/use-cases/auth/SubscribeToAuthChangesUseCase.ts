import type { User } from '../../entities';
import type { IAuthRepository } from '../../repositories';

export class SubscribeToAuthChangesUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(callback: (user: User | null) => void): () => void {
    return this.authRepository.subscribeToAuthChanges(callback);
  }
}