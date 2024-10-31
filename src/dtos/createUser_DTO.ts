import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

class createUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @Length(3, 50)
  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(email: string, name: string, password: string) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}

export default createUserDto;
