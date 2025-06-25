import { IUserRepository } from './interfaces/IUserRepository';
import { ICompanyRepository } from './interfaces/ICompanyRepository';
import { UserRepository } from './UserRepository';
import { CompanyRepository } from './CompanyRepository';

export class RepositoryFactory {
  private static userRepository: IUserRepository;
  private static companyRepository: ICompanyRepository;

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  static getCompanyRepository(): ICompanyRepository {
    if (!this.companyRepository) {
      this.companyRepository = new CompanyRepository();
    }
    return this.companyRepository;
  }
} 