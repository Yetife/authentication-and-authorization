const express = require("express");
const { json } = require("express");
const userRoute = require("./routes/user")
require('dotenv').config();

const app = express();

app.use(json());

app.use('/', userRoute)

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
