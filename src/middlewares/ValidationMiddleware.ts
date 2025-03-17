import { Request, Response, NextFunction } from "express";

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    res.status(400).json({
      error: {
        message: "O campo 'email' é inválido",
        field: "email",
        code: "INVALID_EMAIL_FORMAT",
      },
    });
    return;
  }

  if (!password || password.length < 6) {
    res.status(400).json({
      error: {
        message:
          "O campo 'password' é obrigatório e deve ter pelo menos 6 caracteres.",
        field: "password",
        code: "INVALID_PASSWORD",
      },
    });
    return;
  }

  next();
};

export default validateUser;
