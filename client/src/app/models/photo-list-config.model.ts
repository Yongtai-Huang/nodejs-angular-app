export class PhotoListConfig {
  type: string ='all';

  filters: {
    tag?: string,
    takenBy?: string,
    upvoted?: string,
    downvoted?: string,
    limit?: number,
    offset?: number
  } = {};
}
