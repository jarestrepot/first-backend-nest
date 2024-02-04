import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import  * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor( @InjectModel( User.name ) private userModel: Model<User> ){}

  async create( createUserDto: CreateUserDto ):Promise<User> {

    try {

      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      // Guardamos el usuario de esta forma tan sencilla.
      await newUser.save();

      const { password:_, ...user } = newUser.toJSON();

      // No enviamos la contraseña encriptada
      return user;


    } catch ( error ) {
      if( error.code === 11000 ){
        throw new BadRequestException(`${createUserDto.email } Already exists ` )
      }

      throw new BadRequestException('Something terribe happen!!')
    }
  }

  async login( { email, password }: LoginDto ){

    // Recuperamos al usuario si existe
    const userFind = await this.userModel.findOne({ email });
  
    // validamos las crdenciales
    if ( !userFind ) throw new UnauthorizedException('Not valid credencials');
    if ( !bcryptjs.compareSync( password, userFind.password ) ) throw new UnauthorizedException('Not valid credencials');

    const { password: _, ...user } = userFind.toJSON();

    return {
      data: user,
      token: '132ekhwjkdhwkjdwkdwkld'
    }


    // Usuario y token de acceso(JWT)

  }

  findAll() {
    return `This action returns all auth`;
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
}
