import { IsEmail, IsOptional, IsString } from "class-validator";

class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  assignee?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  ticketPriority?: number;

  @IsOptional()
  @IsEmail()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  clientName?: string;
}

export default UpdateTicketDto;
