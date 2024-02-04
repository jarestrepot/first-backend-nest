import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

  @Prop({ unique: true, required:true })
  email: string;

  @Prop({ required: true,  })
  name: string;

  @Prop({ minLength: 6 , required: true })
  password?: string;

  @Prop({ default: true })
  isActive:boolean;

  @Prop({ type:[ String ], default:['user'] })
  roles: string[];

  // getEmail(): string{
  //   return this.email;
  // }

  // getName(): string {
  //   return this.name;
  // }

  // getPassword(): string {
  //   return this.password;
  // }

  // getIsActive(): boolean {
  //   return this.isActive;
  // }

  // getRole():string[] {
  //   return this.roles;
  // }

  // getDataUser(){
  //   return this;
  // }

}

// Declaración de la entidad.
export const UserSchema = SchemaFactory.createForClass( User );
