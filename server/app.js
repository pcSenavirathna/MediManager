const express = require('express');
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

//Including Routers


app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
});

export default app;