import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import { userService } from "../users/users.service";

// Create Issues :
const createIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// get all issues :

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesFromDB();
    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// get single issue :
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssueFromDB(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// Update issue :

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issuesService.updateIssueFromDB(
      req.body,
      id as string,
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// delete user;

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issuesService.deleteIssueFromDb(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
