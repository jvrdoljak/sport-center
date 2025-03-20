import { PartialType } from "@nestjs/swagger";
import { CreateSportDto } from "./createSport.dto";

export class UpdateSportDto extends PartialType(CreateSportDto) {}
