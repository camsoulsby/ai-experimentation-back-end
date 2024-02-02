import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
});

const expectedAudience = process.env.EXPECTED_AUDIENCE;

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

function getKey(
  header: JwtHeader,
  callback: (err: Error | null, key?: string | Buffer) => void
) {
  client.getSigningKey(header.kid as string, function (err, key) {
    if (err) {
      console.error("Error retrieving signing key:", err);
      callback(err, undefined);
      return;
    }

    // Explicitly check if key is undefined or null
    if (key === undefined || key === null) {
      console.error("Signing key not found for the given kid");
      callback(new Error("Signing key not found"), undefined);
      return;
    }

    let signingKey: string | Buffer;
    if ("publicKey" in key) {
      signingKey = key.publicKey;
    } else if ("rsaPublicKey" in key) {
      signingKey = key.rsaPublicKey;
    } else {
      console.error("Invalid key format");
      callback(new Error("Invalid key format"), undefined);
      return;
    }

    callback(null, signingKey);
  });
}

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access token is required");
  }

  // Safely decode the JWT header with a null check
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || typeof decodedToken === "string") {
    console.error("Invalid JWT structure");
    return res.status(401).send("Invalid token");
  }

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).send("Invalid token");
    }

    // Check if decoded is undefined or not a JwtPayload object
    if (!decoded || typeof decoded === "string") {
      console.error("Invalid token payload");
      return res.status(401).send("Invalid token payload");
    }

    // Now TypeScript knows decoded is a JwtPayload object
    if (decoded.aud !== expectedAudience) {
      console.error("Token's audience does not match the expected audience");
      return res.status(401).send("Invalid token audience");
    }

    (req as RequestWithUser).user = decoded as JwtPayload;

    next();
  });
};
