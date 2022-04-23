const nodemailer =require('nodemailer')


let transporter = nodemailer.createTransport({

    service:"gmail",
    auth: {
        user:"beaslashie@gmail.com",
        pass: "tt801230"
    }
})

let mailOptions ={
    from: "beaslashie@gmail.com",
    to: "oldgee52@gmail.com",
    subject: "Test00",
    text: "trststsdf"

}

export const test =transporter.sendMail(mailOptions, (err, data) => {
    if(err){
        console.log("錯誤", err)
    } else{
        console.log("成功")
    }
} )

