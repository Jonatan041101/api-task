import { IDatabase } from '@/common/base/application/database.interface';
import { FirebaseAdmin } from './firebase-admin.config';
import admin from 'firebase-admin';

export class Database {
  private static instance: Database;
  private adminFirestore: IDatabase | null = null;
  private authFirebase:admin.auth.Auth|null = null

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public initializeAdmin(): IDatabase {
    if (!this.adminFirestore) {
      const firebaseAdmin = FirebaseAdmin.getInstance();
      firebaseAdmin.initialize();
      this.adminFirestore = firebaseAdmin.getFirestore();
      this.authFirebase = firebaseAdmin.getAuth()
    }
    return this.adminFirestore;
  }

  public getAdminFirestore(): IDatabase {
    if (!this.adminFirestore) {
      throw new Error('Admin Firestore not initialized. Call initializeAdmin() first.');
    }
    return this.adminFirestore;
  }
 
  public getAuth(): admin.auth.Auth{
    if (!this.authFirebase) {
      throw new Error('Auth Firebase not initialized. Call initializeAdmin() first.');
    }
    return this.authFirebase;
  }
 
}
