const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { signToken } = require("../utils/jwt");
const { invalidPayloadResponse } = require("../utils/errorHandler");

const userRepository = require("../repositories/authRepository");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || !email || !password) {
      errors.push({ fields: "Campos obrigatórios ausentes" });
    }

    if (errors.length > 0) return invalidPayloadResponse(res, errors);

    const userExists = userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    };

    await userRepository.create(user);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({ id: user.id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true em produção
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

function logout(req, res) {
  res.clearCookie("token");
  res.status(204).send();
}

async function me(req, res) {
  try {
    const user = userRepository.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};
