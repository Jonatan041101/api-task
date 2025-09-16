import { AuthRequest } from "@/common/base/application/interfaces/auth.request.interface";
import { UserService } from "@/modules/iam/user/application/services/user.service";
import { Request, Response, NextFunction } from "express";
import { auth } from "firebase-admin";

// Extiende la interfaz de Request de Express para agregar el objeto `user`

export class AuthenticationMiddleware {
  private readonly auth: auth.Auth;

  constructor(auth: auth.Auth) {
    this.auth = auth;
  }
  validate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    // 1. Obtiene el token del encabezado Authorization
    const accessToken = req.cookies?.accessToken;
    if (!accessToken ) {
      res
        .status(401)
        .json({ error: "No se proporcionó un token de autenticación válido." });
    } else {

      try {
        // 2. Valida el token con el Firebase Admin SDK
        const decodedToken = await this.auth.verifyIdToken(accessToken);
 
        // 3. Adjunta la información del usuario a la solicitud
        req.user = decodedToken; 

        // 4. Pasa al siguiente middleware o controlador
        next();
      } catch (error) {
        // Si la validación falla (token expirado, inválido, etc.)
        console.error("Error al verificar el token:", error);
        res.status(401).json({ error: "Token de autenticación no válido." });
      }
    }
  };
}
