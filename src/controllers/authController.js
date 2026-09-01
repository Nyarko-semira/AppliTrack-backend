const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password , role} = req.body;

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

           if (existingUser) {
            return res.status(409).json({
                message: "A user with this email already exists."
            });
            }

             const passwordHash = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role === "HR" ? "HR" : "USER"
            }
            });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password.' });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return res.status(404).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id,
             role: user.role
             },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

         res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
           }
    });

       
    } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed."
    });
  }
};

module.exports = {
    register,
    Login
};
