import * as admin from "firebase-admin";
import { ISignUpDto } from "../../application/dto/sign-up.dto.interface";
import { FirebaseAdmin } from "@/config/firebase-admin.config";
import { EmailAdapter } from "@/common/base/infrastructure/notifications/email/email.adaptar";
import { FirebaseAuthError } from "firebase-admin/auth";

export class FirebaseAuthService {
  private readonly auth: admin.auth.Auth;
  private readonly emailAdapter: EmailAdapter;
  constructor(auth: admin.auth.Auth) {
    this.auth = auth;
    this.emailAdapter = EmailAdapter.getInstance();
  }

  async signUp(signUpDto: ISignUpDto) {
    await this.auth.createUser({
      email: signUpDto.email,
      emailVerified: false,
    });
    const link = await this.auth.generateEmailVerificationLink(signUpDto.email,{
      url: "http://localhost:4200/",
      handleCodeInApp: true,
    });
    await this.emailAdapter.signUpNotification(signUpDto.email, link);
  }

  async login(signUpDto: ISignUpDto) {
    try {
      await this.auth.getUserByEmail(signUpDto.email);
      await this.signIn(signUpDto);
    } catch (error) {
      if (
        error instanceof FirebaseAuthError &&
        error.code === "auth/user-not-found"
      ) {
        await this.signUp(signUpDto);
      } else {
        console.error("An error occurred during authentication:", error);
        throw error;
      }
    }
  }

  async signIn(signUpDto: ISignUpDto) {
    const link = await this.auth.generateSignInWithEmailLink(signUpDto.email, {
      url: "http://localhost:4200/",
      handleCodeInApp: true,
    });
    await this.emailAdapter.signInNotification(signUpDto.email, link);
  }
}
