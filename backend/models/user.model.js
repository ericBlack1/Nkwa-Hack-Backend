const { query } = require('../config/database');

class User {
  static async create({ firstName, lastName, phone, email, password }) {
    const result = await query(
      'INSERT INTO users (first_name, last_name, phone, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, phone, email, created_at',
      [firstName, lastName, phone, email, password]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const result = await query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );
    return result.rows[0];
  }
}

module.exports = User;
