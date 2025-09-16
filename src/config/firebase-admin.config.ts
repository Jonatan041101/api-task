import { environmentConfig } from '@/config/environment.config';
import admin from 'firebase-admin';

export class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: admin.app.App | null = null;

  private constructor() {}

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  public initialize(): admin.app.App {
    if (!this.app) {
      const existingApp = admin.apps.find(app => app?.name === 'default');
      
      if (existingApp) {
        this.app = existingApp;
      } else {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: environmentConfig.firebase.projectId,
            privateKey: environmentConfig.firebase.privateKey,
            clientEmail:environmentConfig.firebase.clientEmail,
          }),
          storageBucket: environmentConfig.firebase.storageBucket,
          
        });
      }
    }
    return this.app;
  }

  public getApp(): admin.app.App {
    if (!this.app) {
      throw new Error('Firebase Admin not initialized. Call initialize() first.');
    }
    return this.app;
  }

  public getFirestore(): admin.firestore.Firestore {
    return this.getApp().firestore();
  }

  public getAuth(): admin.auth.Auth {
    return this.getApp().auth();
  }
}
