import { pool } from "../../DB/db";
import type { IUser } from "./users.interface";
import bcrypt from "bcryptjs";

// Helper to strip password from a row
const omitPassword = (row: IUser) => {
  const { password: _, ...safeUser } = row;
  return safeUser;
};

// Create user :
const CreateUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, role)
    VALUES($1 , $2 , $3 , $4) RETURNING *
    `,
    [name, email, hashPassword, role],
  );

  result.rows[0] = omitPassword(result.rows[0]);
  return result;
};

// Get all users :
const getAllUsersFromDb = async () => {
  const result = await pool.query(`SELECT * FROM users`);

  result.rows = result.rows.map(omitPassword);
  return result;
};

// Get single user :
const getSingleUserFromDb = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE id=$1
    `,
    [id],
  );

  if (result.rows[0]) {
    result.rows[0] = omitPassword(result.rows[0]);
  }
  return result;
};

// Update user :
const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, email, password, role } = payload;

  const hashPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const result = await pool.query(
    `
    UPDATE users SET
    name     = COALESCE($1, name),
    email    = COALESCE($2, email),
    password = COALESCE($3, password),
    role     = COALESCE($4, role)
    WHERE id = $5
    RETURNING *
    `,
    [name, email, hashPassword, role, id],
  );

  if (result.rows[0]) {
    result.rows[0] = omitPassword(result.rows[0]);
  }
  return result;
};

// Delete user :
const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id=$1
    `,
    [id],
  );
  return result;
};

export const userService = {
  CreateUserIntoDb,
  getAllUsersFromDb,
  getSingleUserFromDb,
  updateUserFromDB,
  deleteUserFromDB,
};