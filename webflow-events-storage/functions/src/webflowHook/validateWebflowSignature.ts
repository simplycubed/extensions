// Import Node's Crypto module
import crypto from "crypto";
import { RequestHandler } from "express";

// Reference: https://developers.webflow.com/docs/verifying-webhook-signatures
// Webhook Request Validation
function validateRequestSignature(
  signature: string,
  timestamp: string,
  body: any,
  consumer_secret: string
) {
  // Return false if timestamp is more than 5 minutes old
  if ((Date.now() - Number(timestamp)) / 60000 > 5) {
    return false;
  }

  // Concatinate the request timestamp header and request body
  const content = Number(timestamp) + ":" + JSON.stringify(body);

  // Generate an HMAC signature from the timestamp and body
  const hmac = crypto
    .createHmac("sha256", consumer_secret)
    .update(content)
    .digest("hex");

  // Create a Buffers from the generated signature and signature header
  const hmac_buffer = Buffer.from(hmac);
  const signature_buffer = Buffer.from(signature);

  // Compare generated signature with signature header checksum and return
  return crypto.timingSafeEqual(hmac_buffer, signature_buffer);
}

export const createValidateWebflowSignatureMw: (
  clientSecret: string
) => RequestHandler = (clientSecret: string) => (req, res, next) => {
  try {
    const request_body = req.body;
    const request_timestamp = (req.headers["X-Webflow-Timestamp"] ||
      req.headers["x-webflow-timestamp"]) as string;
    const request_signature = (req.headers["X-Webflow-Signature"] ||
      req.headers["x-webflow-signature"]) as string;
    if (!request_timestamp || !request_signature) {
      res.status(401).json({
        error: "signature/timestamp is missing to verify the request",
      });
      return;
    }
    if (
      !validateRequestSignature(
        request_signature,
        request_timestamp,
        request_body,
        clientSecret
      )
    ) {
      res.status(401).json({ error: "failed to verify webflow signature" });
    } else {
      next(); // valid request
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "failed to verify webflow signature" });
  }
};
