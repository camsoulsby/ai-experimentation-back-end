"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowedEmails = void 0;
// Middleware function to check email against the allowed list
function checkAllowedEmails(req, res, next) {
    var _a;
    console.log("Checking against email list");
    // Access the environment variable with allowed emails
    const allowedEmails = process.env.ALLOWED_EMAILS || "";
    // Split the allowed emails string into an array
    const allowedEmailsArray = allowedEmails.split(",");
    console.log("Allowed: ", allowedEmailsArray);
    // Assuming you store the user's email in req.user after authentication
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    console.log("User email: ", userEmail);
    // Check if the user's email is in the allowed list
    if (userEmail && allowedEmailsArray.includes(userEmail)) {
        // User is allowed, continue to the next middleware or route
        next();
    }
    else {
        // User is not allowed, send a forbidden response
        res.status(403).json({ message: "Access denied" });
    }
}
exports.checkAllowedEmails = checkAllowedEmails;
