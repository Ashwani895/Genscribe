import jwt from "jsonwebtoken";

console.log("🔐 SECRET IN MIDDLEWARE:", process.env.JWT_SECRET);

const protect = (req, res, next) => {
  console.log("🔥 MIDDLEWARE HIT");
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("TOKEN RECEIVED:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
  console.log("🔥 JWT ERROR MESSAGE:", error.message);
  console.log("🔥 JWT FULL ERROR:", error);

  return res.status(401).json({
    success: false,
    message: "Token verification failed",
  });
}
};

export default protect;