const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");


require("./db/conn");

const Register = require("./models/registers");

const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/register", async (req, res) => {
    try{

        const password = await bcrypt.hash(req.body.password, 5);
        const emailCheck = await Register.findOne({email:req.body.email});

        if(!emailCheck){
            const registerEmplyoee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password
            })

            const registered = await registerEmplyoee.save();
            res.status(201).render("index");

        }else{
            res.send("Email already registered")
        }


    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/login", async (req, res) => {
    try{

        const loginemail = req.body.email;
        const loginpassword = req.body.password;

        const userEmail = await Register.findOne({email:loginemail});
        const isMatch = await bcrypt.compare(loginpassword, userEmail.password);
        
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("email or password invalid")
        }


    } catch (error) {
        res.status(400).send("invalid details");
    }
});

app.listen(port, () => {
    console.log("server is running");
})