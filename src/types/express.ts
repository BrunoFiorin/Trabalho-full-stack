import { Usuario } from "../entities/usuario";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
    interface Response {
      locals: {
        userId?: number;
        user?: Usuario;
      };
    }
  }
}