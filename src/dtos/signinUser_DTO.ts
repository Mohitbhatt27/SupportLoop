import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

class SigninUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Length(3, 50)
  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export default SigninUserDto;
