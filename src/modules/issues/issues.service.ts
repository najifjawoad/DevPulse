import { pool } from "../../DB/db";
import type { IIssue } from "./issues.interface";

// get all issues query params interface :
interface IIssueQuery {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

// create issues :
const createIssuesIntoDB = async (payload: IIssue) => {
  const { title, description, type, status ,reporter_id } = payload;

  const user = await pool.query(
    `
    SELECT * FROM users
    WHERE id=$1
    `,
    [reporter_id],
  );
  if (user.rows.length === 0) {
    throw new Error("User doesn't exist");
  }

  const result = await pool.query(
    `
    INSERT INTO issues
     (title , description , type , status, reporter_id)
     VALUES($1 , $2 , $3 , $4 ,$5)
     RETURNING *
    `,
    [title, description, type, status,reporter_id],
  );

  return result;
};

// get all issues :
const getAllIssuesFromDB = async (query: IIssueQuery) => {
  const { sort = "newest", type, status } = query;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortOrder = sort === "oldest" ? "ASC" : "DESC";

  const result = await pool.query(
    `
    SELECT * FROM issues
    ${whereClause}
    ORDER BY created_at ${sortOrder}
    `,
    values,
  );

  return result;
};

// get single issue :
const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues 
    WHERE id= $1
    `,
    [id],
  );
  return result;
};

// update issue :
const updateIssueFromDB = async (payload: IIssue, id: string) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    UPDATE issues SET 
      title = COALESCE ($1, title),
      description=COALESCE ($2, description),
      type =COALESCE ($3, type)
      
      WHERE id =$4
      RETURNING *
        `,
    [title, description, type, id],
  );
  return result;
};

// Delete issue :
const deleteIssueFromDb = async (id: string) => {
  const result = await pool.query(
    `
       DELETE FROM issues 
      WHERE id=$1
    `,
    [id],
  );
  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDb,
};