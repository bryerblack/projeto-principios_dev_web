import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const roleMiddleware = (roles: ("admin" | "user")[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Acesso negado. Usuário não autenticado." });
      return;
    }

    // if (!roles.includes(req.user.role)) {
    //   res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
    //   return;
    // }

    if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
      res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
      return;
    }

    next();
  };
};
