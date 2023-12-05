export class CreateAboutDto {
  title: string;
  text?: string[];
}

export class UpdateAboutDto {
  title?: string;
  text?: string[];
}
