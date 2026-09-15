import mysql from 'mysql2/promise';
import logger from './Logger.js';

export default class Database {
  constructor(config) {
    this.config = config;
    this.pool = null;
  }

  async initialize() {
    if (this.pool) return this.pool;

    try {
      this.pool = await mysql.createPool(this.config);
      logger.info('Database pool created successfully');
      return this.pool;
    } catch (error) {
      logger.error('Failed to create database pool:', error);
      throw error;
    }
  }

  async getConnection() {
    if (!this.pool) await this.initialize();
    return await this.pool.getConnection();
  }

  async query(sql, values = []) {
    const connection = await this.getConnection();
    try {
      const [results] = await connection.query(sql, values);
      return results;
    } finally {
      connection.release();
    }
  }

  async queryOne(sql, values = []) {
    const results = await this.query(sql, values);
    return results.length > 0 ? results[0] : null;
  }

  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    return await this.query(sql, values);
  }

  async update(table, data, where) {
    const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...Object.values(where)];
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const sql = `UPDATE ${table} SET ${sets} WHERE ${whereClause}`;
    return await this.query(sql, values);
  }

  async delete(table, where) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(where);
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    return await this.query(sql, values);
  }

  async transaction(callback) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database pool closed');
    }
  }
}
