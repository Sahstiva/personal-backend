import { CreateAboutDto, UpdateAboutDto } from './about.dto';
export class CreateExperienceItemDto {
  title: string;
  company: string;
  companyLogo: string;
  load: 'Full-time' | 'Part-Time' | 'Project';
  startDate: Date;
  endDate?: Date;
  current: boolean;
  intro: string;
  list: string[];
  skills: string[];
}

export class CreateExperienceDto extends CreateAboutDto {
  experienceItem: CreateExperienceItemDto[];
}

export class UpdateExperienceDto extends UpdateAboutDto {
  experienceItem?: CreateExperienceItemDto[];
}
