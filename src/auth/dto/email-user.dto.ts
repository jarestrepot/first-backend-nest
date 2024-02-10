import { IsEmail } from "class-validator";


export class CheckEmailDto {

  // valicaciones de la entidad.
  @IsEmail() 
  email:string

}