//  viewRouter.js

import express, { response } from "express";
import {
  courseViewController,
  homeViewController,
  introduceViewController,
  joinViewController,
  loginCallbackController,
  loginViewController,
  profileViewController,
  qrViewController,
} from "../controller/viewController";

const viewRouter = express.Router();

viewRouter.get("/login", loginViewController);
viewRouter.get("/join", joinViewController);
viewRouter.get("/profile", profileViewController);
viewRouter.get("/qr", qrViewController);
viewRouter.get("/courses", courseViewController);
viewRouter.get("/introduce", introduceViewController);
viewRouter.get("/", homeViewController);
viewRouter.get("/login/callback", loginCallbackController);

export default viewRouter;
