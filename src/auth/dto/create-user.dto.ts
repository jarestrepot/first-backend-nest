import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

  // valicaciones de la entidad.
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;

}
