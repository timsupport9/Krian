export default class BaseModel {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async all() {
    return await this.db.query(`SELECT * FROM ${this.tableName}`);
  }

  async find(id) {
    return await this.db.queryOne(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
  }

  async findBy(field, value) {
    return await this.db.queryOne(
      `SELECT * FROM ${this.tableName} WHERE ${field} = ?`,
      [value]
    );
  }

  async create(data) {
    return await this.db.insert(this.tableName, data);
  }

  async update(id, data) {
    return await this.db.update(this.tableName, data, { id });
  }

  async delete(id) {
    return await this.db.delete(this.tableName, { id });
  }

  async count() {
    const result = await this.db.queryOne(
      `SELECT COUNT(*) as count FROM ${this.tableName}`
    );
    return result?.count || 0;
  }

  async paginate(page = 1, perPage = 15) {
    const offset = (page - 1) * perPage;
    const items = await this.db.query(
      `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
      [perPage, offset]
    );
    const total = await this.count();

    return {
      items,
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    };
  }
}
