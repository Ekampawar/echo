exports.authMiddleware = async (req, res, next) => {
  try {
      console.log("Headers:", req.headers); // Debugging headers
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
          console.warn("No token provided");
          return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging token content

      req.user = await User.findById(decoded.id).select('-password');
      console.log("Authenticated User:", req.user); // Debugging user

      if (!req.user) {
          console.warn("User not found");
          return res.status(401).json({ error: 'User not found' });
      }

      next();
  } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({ error: 'Unauthorized' });
  }
};
