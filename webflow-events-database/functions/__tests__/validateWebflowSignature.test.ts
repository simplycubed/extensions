import express from "express";
import crypto from "crypto";
import { createValidateWebflowSignatureMw } from "../src/webflowHook/validateWebflowSignature";
import request from "supertest";
import { json } from "body-parser";
describe("createValidateWebflowSignatureMw", () => {
  const clientSecret = "testsecret";
  const app = express();
  app.use(json({}));
  app.post(
    "/auth",
    createValidateWebflowSignatureMw(clientSecret),
    (req, res) => res.json({ status: "success" })
  );

  it("should allow request when signature is valid", async () => {
    const body = { data: "test" };
    const timestamp = new Date().toDateString();
    const content = Number(timestamp) + ":" + JSON.stringify(body);
    const signature = crypto
      .createHmac("sha256", clientSecret)
      .update(content)
      .digest("hex");
    // send test request
    const { body: response, status } = await request(app)
      .post("/auth")
      .send(body)
      .set("X-Webflow-Timestamp", timestamp)
      .set("X-Webflow-Signature", signature);
    expect(status).toBe(200);
  });

  it("should reject request when signature is invalid", async () => {
    const body = { data: "test" };
    const timestamp = new Date().toDateString();
    // send test request
    const { body: response, status } = await request(app)
      .post("/auth")
      .send(body)
      .set("X-Webflow-Timestamp", timestamp)
      .set("X-Webflow-Signature", "invalid-signature");
    expect(status).toBe(401);
  });
});

// Generate an HMAC signature from the timestamp and body
