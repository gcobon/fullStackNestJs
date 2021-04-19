import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    /** generate salt */
    const salt = bcrypt.genSaltSync();

    /** Hash the password */
    const hash = bcrypt.hashSync(password, salt);

    const user = new User();
    user.username = username;
    user.password = hash;
    user.salt = salt;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        /**  duplicate username */
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialDto,
  ): Promise<string> {
    const { password, username } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
