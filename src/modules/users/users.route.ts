import { Router, type Request, type Response } from "express";
import { userController } from "./users.controller";


const router = Router();

// Create users :
router.post("/auth/signup", userController.createUser);

// Get all users :
router.get("/",userController.getAllUsers );

// Get single user :

router.get("/:id", userController.getSingleUser);

// Update user :
router.put("/:id", userController.updateUser);

// Delete user :
router.delete("/:id", userController.deleteUser );



export const userRoute = router;