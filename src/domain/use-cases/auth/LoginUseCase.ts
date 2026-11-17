import type { User, AuthTokens, LoginCredentials } from '../../entities';
import type { IAuthRepository } from '../../repositories';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    return this.authRepository.login(credentials);
  }
}