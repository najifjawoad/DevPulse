import bcrypt from "bcryptjs";
import { pool } from "../../DB/db";
import jwt from "jsonwebtoken";
import config from "../../config/env";

interface ILogin {
  email: string;
  password: string;
}

const loginUserIntoDb = async (payload: ILogin) => {
  const { email, password } = payload;

  //  Checking if use exists in the table:
  const userData = await pool.query(
    `SELECT * FROM users
     WHERE email=$1`,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("User not in the Database");
  }
  const user = userData.rows[0];

  //   checking if the password is correct :
  const matchPassword = await bcrypt.compare(password, user.password);
  console.log(matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  //   generating jwt token :

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload ,config.jwt_secret as string, {expiresIn :"1d"});

  return {accessToken};
};

export const authService = {
  loginUserIntoDb,
};
