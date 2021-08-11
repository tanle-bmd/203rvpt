//============= HANDLE PROCESS ENVIRONMENT VARIABLE =============
import dotenv from 'dotenv'
dotenv.config()

//============= START SERVER =============
import { Server } from "./Server"

new Server().start()
    .then(() => {
    })
    .catch((err) => {
        console.error(err);
    })
