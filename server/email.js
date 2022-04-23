const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

app.post("/email", (req, res) => {
    const { email, subject, html } = req.body;

    console.log(req.body);

    const mailOptions = {
        from: "beaslashie@gmail.com",
        to: email,
        subject,
        html
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            res.json({
                status: "fail",
            });
        } else {
            res.json({
                status: "success",
            });
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));
