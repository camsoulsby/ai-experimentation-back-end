import { Console } from "console";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

// Define an interface that extends Request to include user - this should be pulled out and defined globally, but I had a lot of trouble doing this
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

// Middleware function to check email against the allowed list
export function checkAllowedEmails(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  console.log("Checking against email list...");

  const allowedEmails: string = process.env.ALLOWED_EMAILS || "";
  const allowedEmailsArray: string[] = allowedEmails.split(",");
  const userEmail: string | undefined =
    req.user?.preferred_username.toLowerCase();
  // Check if the user's email is in the allowed list
  if (userEmail && allowedEmailsArray.includes(userEmail)) {
    // User is allowed, continue to the next middleware or route
    next();
  } else {
    // User is not allowed, send a forbidden response
    res.status(403).json({ message: "Access denied." });
  }
}
