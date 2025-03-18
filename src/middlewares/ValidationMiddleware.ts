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

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@!#])[0-9a-zA-Z$*&@#]{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    res.status(400).json({
      error: {
        message:
          "O campo 'password' deve ter pelo menos 8 caracteres, incluindo ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial ($*&@!#).",
        field: "password",
        code: "INVALID_PASSWORD",
      },
    });
    return;
  }

  next();
};

export default validateUser;
