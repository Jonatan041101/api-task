import express, {Request,Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Database } from "./config/database.config";
import { UserModule } from "./modules/iam/user/user.module";
import { TaskModule } from "./modules/task/task.module";
import { environmentConfig } from "./config/environment.config";
import { AuthenticationModule } from "./modules/iam/authentication/authentication.module";
import cookieParser from "cookie-parser"

dotenv.config();

class App {
  private app: express.Application;
  private port: number;
  private database: Database = Database.getInstance();
  constructor() {
    this.app = express();
    this.port = environmentConfig.port;

    this.initializeFirebase();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initialize404Handling()
    this.initializeErrorHandling();
  }

  private initializeFirebase(): void {
    try {
      this.database.initializeAdmin();
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Firebase Admin", error as Error);
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: "http://localhost:4200",
        credentials: true,
        methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
      })
    );

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(cookieParser()); 
    this.app.use(express.urlencoded({ extended: true }));

  }

  private initializeRoutes(): void {
    const db = this.database.getAdminFirestore();
    const auth = this.database.getAuth()
    const userModule = new UserModule(db);
    const taskModule = new TaskModule(db,auth);
    const authenticationModule = new AuthenticationModule(db,auth)

    this.app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
        environment: environmentConfig.nodeEnv,
      });
    });

    this.app.use("/api/v1/user", userModule.getRouter());
    this.app.use("/api/v1/task", taskModule.getRouter());
    this.app.use("/api/v1/auth", authenticationModule.getRouter());
  }

  private initialize404Handling(): void {
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });
    
  }
  private initializeErrorHandling(): void {
    this.app.use(
      (
        err: Error,
        req: Request,
        res: Response,
        next:NextFunction
      ) => {
        console.error(err)
          res.status(500).json({
            success: false,
            message: "Internal server error",
            ...(environmentConfig.nodeEnv === "development" && {
              error: err.message,
            }),
          });
      }
    );
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📝 Environment: ${environmentConfig.nodeEnv}`);
    });
  }
}

const app = new App();
app.start();
