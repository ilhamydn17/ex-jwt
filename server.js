import express from "express"
import db from "./config/database.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import User from "./models/User.js" // jika model User sudah di eksekusi maka kode ini tidak perlu dijalankan lagi 
import appRoute from "./routes/route.js"
import bodyParser from "body-parser"

dotenv.config();

try {
    await db.authenticate()
    console.log('database terhubung')
    // await User.sync(); // mengeksekusi model User, jika sudah tabel sudah ada maka kode ini tidak perlu digunakan
} catch (error) {
    console.log(error);
}

const app = express()
const port = 3000

app.use(cookieParser());
app.use(express.json());
app.use(appRoute);

app.listen(3000, () => {
    console.log('aplikasi berjalan di url localhost:3000')
})