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
		  'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
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
  
  static async findByEmailOrPhone(identifier) {
    const result = await query(
      `SELECT * FROM users 
       WHERE email = $1 OR phone = $1`,
      [identifier]
    );
    return result.rows[0];
  }
  
  static async findById(id) {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return null; // Explicitly return null if no user found
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error in findById:', error);
    throw error;
  }
}
  
  static async updateUserOTP({ id, email, phone, phone_otp, email_otp, phone_otp_expiry, email_otp_expiry }) {
    let queryText = 'UPDATE users SET ';
    const queryParams = [];
    let paramCount = 1;
    let updates = [];

    if (phone_otp) {
      updates.push(`phone_otp = $${paramCount++}`);
      queryParams.push(phone_otp);
    }
    if (email_otp) {
      updates.push(`email_otp = $${paramCount++}`);
      queryParams.push(email_otp);
    }
    if (phone_otp_expiry) {
      updates.push(`phone_otp_expiry = $${paramCount++}`);
      queryParams.push(phone_otp_expiry);
    }
    if (email_otp_expiry) {
      updates.push(`email_otp_expiry = $${paramCount++}`);
      queryParams.push(email_otp_expiry);
    }

    queryText += updates.join(', ');

    if (email) {
      queryText += ` WHERE email = $${paramCount}`;
      queryParams.push(email);
    } else if (phone) {
      queryText += ` WHERE phone = $${paramCount}`;
      queryParams.push(phone);
    } else if (id) {
      queryText += ` WHERE id = $${paramCount}`;
      queryParams.push(id);
    }

    await query(queryText, queryParams);
  }

  static async updateUserVerification(id, { phone_verified, email_verified, phone_otp, email_otp, phone_otp_expiry, email_otp_expiry }) {
    let queryText = 'UPDATE users SET ';
    const queryParams = [];
    let paramCount = 1;
    let updates = [];

    if (phone_verified !== undefined) {
      updates.push(`phone_verified = $${paramCount++}`);
      queryParams.push(phone_verified);
    }
    if (email_verified !== undefined) {
      updates.push(`email_verified = $${paramCount++}`);
      queryParams.push(email_verified);
    }
    if (phone_otp !== undefined) {
      updates.push(`phone_otp = $${paramCount++}`);
      queryParams.push(phone_otp);
    }
    if (email_otp !== undefined) {
      updates.push(`email_otp = $${paramCount++}`);
      queryParams.push(email_otp);
    }
    if (phone_otp_expiry !== undefined) {
      updates.push(`phone_otp_expiry = $${paramCount++}`);
      queryParams.push(phone_otp_expiry);
    }
    if (email_otp_expiry !== undefined) {
      updates.push(`email_otp_expiry = $${paramCount++}`);
      queryParams.push(email_otp_expiry);
    }

    queryText += updates.join(', ') + ` WHERE id = $${paramCount}`;
    queryParams.push(id);

    await query(queryText, queryParams);
  }

  static async updateUserResetToken(id, resetToken, resetTokenExpiry) {
    await query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, id]
    );
  }

  static async findByResetToken(token) {
    const result = await query(
      'SELECT * FROM users WHERE reset_token = $1',
      [token]
    );
    return result.rows[0];
  }

  static async updateUserPassword(id, newPassword) {
    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [newPassword, id]
    );
  }

  static async clearResetToken(id) {
    await query(
      'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1',
      [id]
    );
  }

}

module.exports = User;
