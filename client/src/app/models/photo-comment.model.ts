import { Profile } from './profile.model';

export class PhotoComment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}
