import { Profile } from './profile.model';

export class Photo {
  slug: string;
  title: string = '';
  description: string = '';
  tagList: Array<string> = [];
  takenAt: string;
  createdAt: string;
  updatedAt: string;
  upvoted: boolean;
  downvoted: boolean;
  upvotesCount: number;
  downvotesCount: number;
  takenBy: Profile;
  image: string;
}
