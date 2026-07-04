import morgan from "morgan";
import { NODE_ENV } from "../config/env.js";

const logger = morgan(NODE_ENV === "development" ? "dev" : "combined");

export default logger;
