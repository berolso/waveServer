const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Instructional {
  // create instructional
  static async create(data) {
    const result = await db.query(
      `
      INSERT INTO instructionals (name,
        section_id,
        json)
        VALUES ($1, $2, $3)
        RETURNING id, name, section_id AS "sectionId", json
        `,
      [data.name, data.sectionId, data.json]
    );
    const instructional = result.rows[0];
    return instructional;
  }

  // get all
  static async findAll() {
    const result = await db.query(
      `SELECT id,
          name,
          json
          FROM instructionals
          ORDER BY id`
    );
    return result.rows;
  }
  // get by id
  static async get(id) {
    const result = await db.query(
      `SELECT id,
          name,
          json
          FROM instructionals
          WHERE id = $1`,
      [id]
    );
    const instructional = result.rows[0];

    if (!instructional)
      throw new NotFoundError(` Instructional:${id} not found`);
    return result;
  }

  // update instructional
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);
    const querySql = `
      UPDATE instructionals SET ${setCols} 
      WHERE id = ${idVarIdx}
      RETURNING id, name, json
    `;
    const result = await db.query(querySql, [...values, id]);
    const instructional = result.rows[0];

    if (!instructional)
      throw new NotFoundError(` Instructional:${id} not found`);
    return instructional;
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE
    FROM instructionals
    WHERE id = $1
    RETURNING id`,
      [id]
    );
    const instructional = result.rows[0];

    if (!instructional)
      throw new NotFoundError(` Instructional:${id} not found`);
    return instructional;
  }
}

module.exports = Instructional;
