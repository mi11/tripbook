import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateSaltedPassword } from '../utilities/generateSaledPassword';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { createTempPassword } from '../utilities/createTempPassword';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.find(createUserDto.email);
    if (user) {
      throw new BadRequestException('email in use');
    }

    return await this.create({
      ...createUserDto,
      password: await generateSaltedPassword(createUserDto.password),
    });
  }

  async signIn(createUserDto: CreateUserDto) {
    const user = await this.find(createUserDto.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async createIfNotExist(createUserDto: CreateUserDto) {
    const user = await this.find(createUserDto.email);
    if (user) {
      return user;
    }

    const tempPassword = createTempPassword(5);

    // TODO: send tempPassword to email
    console.log('123', createUserDto);
    return await this.create({
      ...createUserDto,
      password: await generateSaltedPassword(tempPassword),
    });
  }

  create(createUserDto: CreateUserDto) {
    const user = this.repo.create(createUserDto);

    console.log(user);

    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, updateUserDto);
    if (updateUserDto.password) {
      user.password = await generateSaltedPassword(updateUserDto.password);
    }

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
