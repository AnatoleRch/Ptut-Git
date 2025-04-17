//const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");
import { createUser, updateUser, deleteUser } from "./functions-src/userFunctions.js";


export { createUser, updateUser, deleteUser }