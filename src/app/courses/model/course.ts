import { ILesson } from './lesson';

export interface ICourse {
  _id: string;
  name: string;
  category: string;
  lessons?: ILesson[];
}
