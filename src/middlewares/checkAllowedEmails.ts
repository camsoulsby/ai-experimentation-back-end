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
  console.log("Checking against email list");
  // Access the environment variable with allowed emails
  const allowedEmails: string = process.env.ALLOWED_EMAILS || "";

  // Split the allowed emails string into an array
  const allowedEmailsArray: string[] = allowedEmails.split(",");
  console.log("Allowed: ", allowedEmailsArray);

  // Assuming you store the user's email in req.user after authentication
  console.log("User payload: ", req.user);
  const userEmail: string | undefined = req.user?.preferred_username;
  console.log("User email: ", userEmail);
  // Check if the user's email is in the allowed list
  if (userEmail && allowedEmailsArray.includes(userEmail)) {
    // User is allowed, continue to the next middleware or route
    next();
  } else {
    // User is not allowed, send a forbidden response
    res.status(403).json({ message: "Access denied" });
  }
}
