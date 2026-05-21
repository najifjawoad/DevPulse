import { pool } from "../../DB/db";

// create issues :
const createIssuesIntoDB = async (payload: any) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues
     (title , description , type , reporter_id)
     VALUES($1 , $2 , $3 , $4)
     RETURNING *
    `,
    [title, description, type, reporter_id],
  );

  return result;
};

// get all issues :
const getAllIssuesFromDB = async () => {
  const result = await pool.query(`
          SELECT * FROM issues 
        `);
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
const updateIssueFromDB = async (payload: any, id: string) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    UPDATE issues SET 
      title = COALESCE ($1, title),
      description=COALESCE ($2, description),
      type =COALESCE ($3, type)
      

      WHERE id =$4
      RETURNING *
        `, [title , description , type,id]
  );
  return result;
};

// Delete issue :
const deleteIssueFromDb = async (id : string)=>{

const result = await pool.query(`
       DELETE FROM issues 
      WHERE id=$1
    `,[id]);
    return result;
}
export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDb
};
