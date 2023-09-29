import { Router } from "express";
import express from "express";
import fileUpload from "express-fileupload";
import path from "path";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.routes = routes;
    this.publicPath = public_path;
  }

  async start() {
    //TODO: MIDLEWARES
    this.app.use(express.json()); // for parsing application/json (body)
    this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    this.app.use(
      // for parsing multipart/form-data (file upload)
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      })
    );

    //TODO: PUBLIC FOLDER
    this.app.use(express.static(this.publicPath)); // public folder (static files)

    //TODO: ROUTES
    this.app.use(this.routes); // routes (api)

    //TODO: SPA
    /*this.app.get("*", (req, res) => {
      // SPA (single page application) fallback
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });*/

    this.serverListener = this.app.listen(this.port, () => {
      // start server
      console.log(`App listening at http://localhost:${this.port}`);
    });
  }

  public close() {
    // close server (for testing)
    this.serverListener.close();
  }
}
