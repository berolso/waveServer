const bcrypt = require("bcrypt");

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { sqlForPartialUpdate } = require("../helpers/sql");

class User {
  // authenticate user
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone_number AS "phoneNumber",
              is_admin AS "isAdmin",
              is_full_access AS "isFullAccess"
       FROM users
       WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
      throw new UnauthorizedError("Invalid username/password");
    }
  }

  // CREATE
  // check for duplictate username since username will be primary key
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    isAdmin,
    isFullAccess
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username]
    );
    // if duplicate throw custom error
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    // hash password with bcrypt before storing in DB
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // add user to database
    const result = await db.query(
      `INSERT INTO users
       (username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        is_admin,
        is_full_access)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING username, first_name AS "firstName", last_name AS "lastName", email, phone_number AS "phoneNumber", is_admin AS "isAdmin", is_full_access AS "isFullAccess"`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        phoneNumber,
        isAdmin,
        isFullAccess,
      ]
    );

    const user = result.rows[0];
    return user;
  }
  // READ
  // find all users
  static async findAll() {
    const result = await db.query(
      `SELECT username,
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      phone_number,
      is_admin AS "isAdmin",
      is_full_access
      FROM users
      ORDER BY username`
    );

    return result.rows;
  }

  // READ
  // find user by username
  static async get(username) {
    const res = await db.query(
      `
    SELECT username,
    first_name AS "firstName",
    last_name AS "lastName",
    email,
    phone_number,
    is_admin AS "isAdmin",
    is_full_access
    FROM users
    WHERE username = $1`,
      [username]
    );
    const user = res.rows[0];

    // if user not found in DB return custom error
    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  // UPDATE
  // update user details.
  static async updateUser(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      phoneNumber: "phone_number",
      isAdmin: "is_admin",
      isFullAccess: "is_full_access",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
      SET ${setCols} 
      WHERE username = ${usernameVarIdx} 
      RETURNING username,
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      phone_number,
      is_admin AS "isAdmin",
      is_full_access AS "isFullAccess"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  // DElETE
  static async deleteUser(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
