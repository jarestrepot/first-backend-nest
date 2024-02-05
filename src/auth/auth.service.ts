import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { LoginResponse } from './interfaces/login-response';
import { JwtPayload } from './interfaces/jwt-payload';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name)
  private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      // Guardamos el usuario de esta forma tan sencilla.
      await newUser.save();

      const { password: _, ...user } = newUser.toJSON();

      // No enviamos la contraseña encriptada
      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} Already exists `)
      }

      throw new BadRequestException('Something terribe happen!!')
    }
  }

  async register( registerUserDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerUserDto );

    return {
      user: user,
      token: await this.getJwtToken({ id: user._id })
    }

  }

  async login({ email, password }: LoginDto): Promise<LoginResponse> {

    // Recuperamos al usuario si existe
    const userFind = await this.userModel.findOne({ email });

    // validamos las crdenciales
    if ( !userFind ) throw new UnauthorizedException('Not valid credencials');
    if ( !bcryptjs.compareSync(password, userFind.password) ) throw new UnauthorizedException('Not valid credencials');

    const { password: _, ...user } = userFind.toJSON();

    return {
      user: user,
      token: await this.getJwtToken({ id: userFind.id }),
    }

  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user =  await this.userModel.findById( id );
    const { password, ...restUser } = user.toJSON()
    return restUser;
  }

  async checkTokenUser( token: string ){
    
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async getJwtToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
