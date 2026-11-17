import type { User, AuthTokens, RegisterData } from '../../entities';
import type { IAuthRepository } from '../../repositories';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    return this.authRepository.register(data);
  }
}