const authService = require('../services/authservice');

// Controller for user registration
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await authService.registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
