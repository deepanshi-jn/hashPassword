const express=require('express')
const app=express()
const userModel=require("./models/user")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path=require('path')

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.render('index')
})

app.post("/create",(req,res)=>{
    let {username,email,password,age}=req.body
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
            let createdUser=await userModel.create({
                username,
                email,
                password:hash,
                age
            })

            //{email:email}=={email}
            //.sign=>user ka data rkhna
            let token=jwt.sign({email},"shhhhhhh")
            res.cookie("token",token)
            res.send(createdUser)
        })
    })
})
app.get("/login", (req, res) => {
    res.render("login"); // Render the login.ejs file
});
app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.send("User not found");

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: user.email }, "shhhhhhh");
            res.cookie("token", token);
            res.send("Yes, you can login"); // Use res.send here
        } else {
            res.send("Something is wrong"); // Use res.send here
        }
    });
});



app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
})

app.listen(3000)