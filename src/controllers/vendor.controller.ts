import { Request, Response } from "express";
import * as argon2 from "argon2";
import { isValidEmail, isValidPhone } from "../utils";
import { validCountryCodes } from "../constant";
const { prisma } = require("../client/prisma");

const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, kyc_metadata, email, password, phone, phone_country_code } =
      req.body;

    if (!name || !email || !password || !phone || !phone_country_code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Invalid phone format" });
    }

    if (!validCountryCodes.includes(String(phone_country_code))) {
      return res.status(400).json({ error: "Invalid phone country code" });
    }

    const hashedPassword = await argon2.hash(password);

    const newVendor = await prisma.vendor.create({
      data: {
        name,
        kyc_metadata,
        email,
        password: hashedPassword,
        phone,
        phone_country_code,
      },
    });

    return res.status(201).json(newVendor);
  } catch (error: any) {
    console.error("Error listing vendors", error);
    let errorMessage = "Error adding vendor";
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

const listVendors = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10, ...filters } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filterOptions: any = {};
    Object.keys(filters).forEach((key) => {
      filterOptions[key] = { equals: filters[key] };
    });

    const vendors = await prisma.vendor.findMany({
      where: filterOptions,
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        name: true,
        kyc_metadata: true,
        email: true,
        phone: true,
        phone_country_code: true,
        created_at: true,
        updated_at: true,
      },
    });

    return res.json(vendors);
  } catch (error: any) {
    console.error("Error listing vendors", error);
    let errorMessage = "Error listing vendors";
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export { createVendor, listVendors };
