export class PhotoListConfig {
  type: string ='all';

  filters: {
    tag?: string,
    createdBy?: string,
    upvoted?: string,
    downvoted?: string,
    limit?: number,
    offset?: number
  } = {};
}
