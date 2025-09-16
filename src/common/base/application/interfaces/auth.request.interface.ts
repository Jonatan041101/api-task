import { auth } from "firebase-admin";
import { Request} from "express";

export interface AuthRequest extends Request {
    user?: auth.DecodedIdToken
  }