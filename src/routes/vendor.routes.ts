import { Router } from "express";
import * as vendorController from "../controllers/vendor.controller";
// Import any necessary middleware (e.g., for authentication, validation)

const router = Router();

// Create Vendor Route
router.get("/", vendorController.listVendors);
router.post("/", vendorController.createVendor);

export default router;
