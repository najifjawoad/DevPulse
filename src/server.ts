import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";
const app: Application = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_B7aTY8lRGhOU@ep-lucky-band-aqor2r4f-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
CREATE TABLE  IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'contributor',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse server",
    author: "next level",
  });
});

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, role)
    VALUES($1 , $2 , $3 , $4) RETURNING *
    `,
      [name, email, password, role],
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(201).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);
    res.status(201).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows,
    });
    console.log(result);
  } catch (error : any) {
        res.status(201).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
