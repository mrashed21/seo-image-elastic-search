export class QueryBuilder {
  public filter: Record<string, any> = {};
  public page: number;
  public limit: number;
  public skip: number;
  public sort: Record<string, 1 | -1>;

  constructor(query: any) {
    this.page = Number(query.page) || 1;
    this.limit = Number(query.limit) || 10;
    this.skip = (this.page - 1) * this.limit;

    this.sort = {};

    if (query.sortBy) {
      this.sort[query.sortBy] = query.sortOrder === "desc" ? -1 : 1;
    }
  }

  search(searchTerm: string, fields: string[]) {
    if (searchTerm) {
      this.filter.$or = fields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      }));
    }

    return this;
  }

  status(status?: string) {
    if (status) {
      this.filter.category_status = status;
    }

    return this;
  }

  getMeta(total: number) {
    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPage: Math.ceil(total / this.limit),
    };
  }
}
