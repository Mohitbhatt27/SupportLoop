import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class createTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEmail()
  @IsString()
  assignee: string;

  @IsEmail()
  @IsString()
  assignedTo: string;

  @IsEmail()
  @IsString()
  createdBy: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this.assignee = "";
    this.assignedTo = "";
    this.createdBy = "";
  }
}

export default createTicketDto;
