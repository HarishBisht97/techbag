import request from "supertest";
import app from "../app"; // Assuming your Express app is exported from app.ts
import { prisma } from "../client/prisma"; // Import prisma object correctly

require("dotenv").config({ path: ".env" });

const testVendors = [
  {
    name: "Vendor 1",
    email: "vendor1_test_email@example.com",
    kyc_metadata: {
      company_pAN: "1234567890",
      contracts: ["contract1.pdf", "contract2.pdf"],
      agreements: ["agreement1.pdf", "agreement2.pdf"],
    },
    password: "password1",
    phone: "1234567890",
    phone_country_code: 1,
  },
  {
    name: "Vendor 2",
    email: "vendor2_test_email@example.com",
    kyc_metadata: {
      company_pAN: "1234567890",
      contracts: ["contract1.pdf", "contract2.pdf"],
      agreements: ["agreement1.pdf", "agreement2.pdf"],
    },
    password: "password2",
    phone: "9876543210",
    phone_country_code: 1,
  },
];

describe("Vendor API", () => {
  beforeAll(async () => {
    await prisma.vendor.createMany({
      data: testVendors,
    });
  });

  describe("Vendor CRUD operations", () => {
    //test vendor fetch
    it("should get a list of vendors", async () => {
      const response = await request(app).get("/vendors");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    //test pagination
    it("should get a list of 5 vendors", async () => {
      const response = await request(app).get("/vendors?limit=2");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body) && response.body.length == 2).toBe(
        true
      );
    });

    //test filters
    it("should get a list of 1 vendor", async () => {
      const response = await request(app).get(
        "/vendors?email=vendor1_test_email@example.com"
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body) && response.body.length == 1).toBe(
        true
      );
    });

    it("should create a new vendor", async () => {
      const newVendor = {
        name: "Example Vendor",
        kyc_metadata: {
          company_pAN: "1234567890",
          contracts: ["contract1.pdf", "contract2.pdf"],
          agreements: ["agreement1.pdf", "agreement2.pdf"],
        },
        email: "vendor3_test_email@example.com",
        password: "secretpassword",
        phone: "8384871840",
        phone_country_code: 1,
      };
      const response = await request(app).post("/vendors").send(newVendor);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newVendor.name);
    });

    it("should return 400 if missing required fields", async () => {
      const invalidVendor = { name: "Invalid Vendor" };
      const response = await request(app).post("/vendors").send(invalidVendor);
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    const testEmails = [
      "vendor2_test_email@example.com",
      "vendor1_test_email@example.com",
      "vendor3_test_email@example.com",
    ];

    await prisma.vendor.deleteMany({
      where: {
        email: {
          in: testEmails,
        },
      },
    });
    await app.close();
  });
});
