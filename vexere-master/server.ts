import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import methodOverride from "method-override";
import { ExpressHandlebars } from "express-handlebars";

import indexHandler from "./routes/Index/index";

//AN
import { bookingDetailCallbackHandler } from "./routes/BookingDetail/bookingPaymentl";
import bookingPaymentHandler from "./routes/BookingDetail/bookingPaymentl";
// import bookingDetailHandler,{PaymentLogic} from "./routes/Ticket/TicketAn/TicketAn";
//import ticketDetailHandler from "./routes/BookingDetail/bookingDetail";

import * as url from "url";
import { PrismaClient } from "@prisma/client";
import { auth, requiresAuth } from "express-openid-connect";
import UserSessionManager from "./routes/helper/userSession/userSession";

import locationGenerate from "./routes/test/createMockData/mockLocation";
import routeGenerate from "./routes/test/createMockData/mockRoute";
import busHouseGenerate from "./routes/test/createMockData/mockBusHouse";
import usersGenerate from "./routes/test/createMockData/mockUser";
import busGenerate from "./routes/test/createMockData/mockBus";
import routeDetailGenerate from "./routes/test/createMockData/mockRouteDetail";

import checkUser from "./routes/db/checkUser";
import searchRouteHandler from "./routes/Search/search";
import userDashboardHandler from "./routes/UserDashboard/UserDashboard";
import createTicket from "./routes/Ticket/ticket";
import bodyParser from "body-parser";

import { adminAddRouteDetailHandler, adminEditRouteDetailHandler, addRouteDetailHandler, editRouteDetailHandler, deleteRouteDetailHandler, adminRouteDetailAPI_GET, adminRouteDetailAPI_POST, adminRouteDetailAPI_PUT } from "./routes/RouteDetailAdmin/routeDetailAdmin";
import adminRouteDetailHandler from "./routes/RouteDetailAdmin/routeDetailAdmin";

import adminDashBoard from "./routes/Admin/admin";
import adminTicketAPI from "./routes/Admin/ticket";

import busAdminHandler from "./routes/BusAdmin/busAdmin";
import ticketDetailHandler from "./routes/BookingDetail/bookingDetail";
import createRating from "./routes/BookingDetail/createRating";
import adminBusHouseHandler from "./routes/Admin/bushouse";
import userTicketsApi, { cancelTicketHandler } from "./routes/UserDashboard/Ticket";
import BusHouseRouteHandler from "./routes/BusHouse/BusHouse";
import {helpers} from "./views/helpers/helpers.js";


const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const sessionManager = new UserSessionManager();
export { sessionManager };

dotenv.config();
const app: Express = express();
app.use(methodOverride('_method'));

const handlebars = new ExpressHandlebars({
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials`,
  helpers:helpers,
  defaultLayout: "layout",
  extname: "hbs",
});

const port = process.env.PORT || 8000;
const configAuth = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRETE,
  baseURL: `http://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: "https://dev-j07rhfbc.us.auth0.com",
};
if (!process.env.BASE_URL && process.env.NODE_ENV !== "production") {
  configAuth.baseURL = `http://localhost:${port}`;
}
if (process.env.RENDER_EXTERNAL_URL) {
  configAuth.baseURL = process.env.RENDER_EXTERNAL_URL;
}

app.use(auth(configAuth));
app.use(bodyParser.urlencoded({ extended: false }));

const bodyPraseObj = bodyParser.json();
bodyParser.urlencoded
app.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  res.locals.userName = req.oidc.user ? req.oidc.user.name : null;
  next();
}, checkUser);

const prisma = new PrismaClient();
prisma.$connect();
export { prisma };

app.use(express.static(__dirname + "/public"));

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

app.get("/", indexHandler);

app.get("/search", searchRouteHandler);
app.get("/user", userDashboardHandler);
app.get("/house",BusHouseRouteHandler);

// app.get("/user/ticket", bookingDetailHandler);
// app.get("/user/ticket",ticketDetailHandler);
app.get("/search", searchRouteHandler);

//ADMIN
app.get("/admin/route_detail", adminRouteDetailHandler);
app.get("/admin/route_detail/add", adminAddRouteDetailHandler);
app.get("/admin/route_detail/edit/:id", adminEditRouteDetailHandler); // pass query route detail id
app.post("/api/route_detail/add", addRouteDetailHandler);
app.put("/api/route_detail/edit/:id", editRouteDetailHandler);
app.delete("/api/route_detail/delete/:id", deleteRouteDetailHandler);

app.get("/admin/api/route_detail", adminRouteDetailAPI_GET);
app.post("/admin/api/route_detail",bodyPraseObj,adminRouteDetailAPI_POST);
app.put("/admin/api/route_detail",bodyPraseObj,adminRouteDetailAPI_PUT)

app.get("/admin", adminDashBoard);
app.use("/admin/api/ticket", bodyPraseObj, adminTicketAPI);
app.use("/admin/api/bushouse", bodyPraseObj, adminBusHouseHandler);
app.use("/admin/api/bus", bodyPraseObj, busAdminHandler);
//==========


//USER TICKET
app.use("/user/api/tickets",userTicketsApi);

app.post("/user/ticket/cancel",cancelTicketHandler);
app.get("/user/ticket/pay", bookingPaymentHandler);
app.get("/user/ticket/callback", bookingDetailCallbackHandler);
app.get("/user/ticket",ticketDetailHandler);
app.post("/api/ticket",bodyPraseObj,createTicket);
app.post("/user/ticket/rate",bodyPraseObj,createRating);
//========


//MOCK DATA
app.get("/api/test/generate/locations", locationGenerate);
app.get("/api/test/generate/routes", routeGenerate);
app.get("/api/test/generate/bushouses", busHouseGenerate);
app.get("/api/test/generate/users", usersGenerate);
app.get("/api/test/generate/buses", busGenerate);
app.get("/api/test/generate/details", routeDetailGenerate);
// app.get("/api/test/search", searchRouteAPI);
//============

app.get("/api/test/profile", (req, res) => {
  res.json({
    status: req.oidc.isAuthenticated() ? "Logged in" : "Logged out",
    data: req.oidc.user,
    userDB: null,
  });
});



app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
