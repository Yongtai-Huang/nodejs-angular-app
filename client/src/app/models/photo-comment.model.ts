import { Profile } from './profile.model';

export class PhotoComment {
  id: string;
  body: string;
  createdAt: string;
  author: Profile;
}
