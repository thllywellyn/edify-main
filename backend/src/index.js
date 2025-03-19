import dotenv from "dotenv";
import db from './database/db.js';
import { app } from './app.js';
import cors from 'cors';

app.use(cors({
  origin: 'https://edify-main.onrender.com', // Specific origin required
  credentials: true // Enable credentials
}));
console.log("CORS configured successfully");

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
