import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, JwtHeader } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
});

// Define an interface that extends Request to include user
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

function getKey(
  header: JwtHeader,
  callback: (err: Error | null, key?: string | Buffer) => void
) {
  client.getSigningKey(header.kid as string, function (err, key) {
    if (err) {
      callback(err, undefined);
      return;
    }
    const signingKey =
      (key as jwksClient.CertSigningKey).publicKey ||
      (key as jwksClient.RsaSigningKey).rsaPublicKey;
    callback(null, signingKey);
  });
}

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Log the received token
  // console.log("Received token:", token);

  if (!token) {
    return res.status(401).send("Access token is required");
  }

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).send("Invalid token");
    }

    // Use type assertion here
    (req as RequestWithUser).user = decoded as JwtPayload;
    next();
  });
};
