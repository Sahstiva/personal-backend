import { CreateAboutDto, UpdateAboutDto } from './about.dto';
export class CreateExperienceItemDto {
  position: string;
  company: string;
  companyLogo: string;
  load: 'Full-time' | 'Part-Time' | 'Project';
  startDate: Date;
  endDate?: Date;
  current: boolean;
  region: string;
  place: 'Remote' | 'Office' | 'Hybrid';
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
