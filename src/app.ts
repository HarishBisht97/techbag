import express from "express";
import bodyParser from "body-parser";
import vendorRoutes from "./routes/vendor.routes";
const app = express();

app.use(bodyParser.json());

app.use("/vendors", vendorRoutes);

(async () => {
  try {
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
})();
