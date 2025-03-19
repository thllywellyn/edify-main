import dotenv from "dotenv";
import db from './database/db.js';
import { app } from './app.js';
import cors from 'cors';

app.use(cors({
  origin: '*', // Allows all origins
  credentials: false // Credentials disabled
}));
console.log("cors done")

dotenv.config({
  path: './.env'
});

console.log(`${process.env.DB_NAME}`);

db()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection failed !!!", err);
  });
