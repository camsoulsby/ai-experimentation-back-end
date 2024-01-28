"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = (0, jwks_rsa_1.default)({
    jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
});
const expectedAudience = process.env.EXPECTED_AUDIENCE;
console.log("Expected audience", expectedAudience);
// // Define an interface that extends Request to include user
// interface RequestWithUser extends Request {
//   user?: JwtPayload;
// }
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
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
        let signingKey;
        if ("publicKey" in key) {
            signingKey = key.publicKey;
        }
        else if ("rsaPublicKey" in key) {
            signingKey = key.rsaPublicKey;
        }
        else {
            console.error("Invalid key format");
            callback(new Error("Invalid key format"), undefined);
            return;
        }
        // console.log("Retrieved signing key ID:", key.kid);
        // console.log("Retrieved signing key:", signingKey);
        callback(null, signingKey);
    });
}
const validateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    // Log the received token
    // console.log("Received token:", token);
    if (!token) {
        return res.status(401).send("Access token is required");
    }
    // Safely decode the JWT header with a null check
    const decodedToken = jsonwebtoken_1.default.decode(token, { complete: true });
    if (!decodedToken || typeof decodedToken === "string") {
        console.error("Invalid JWT structure");
        return res.status(401).send("Invalid token");
    }
    console.log("Decoded JWT Header:", decodedToken.header);
    jsonwebtoken_1.default.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
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
        // Use type assertion here
        req.user = decoded;
        next();
    });
};
exports.validateJWT = validateJWT;
