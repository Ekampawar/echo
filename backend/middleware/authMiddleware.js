module.exports = (req, res, next) => {
    console.log("Incoming request to protected route");

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log("No Authorization header found");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("No token found in Authorization header");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified. User:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        res.status(400).json({ message: 'Invalid token.' });
    }
};
