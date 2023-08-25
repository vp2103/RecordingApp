import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

app.post('/api/register', async (req, res) => {
    console.log(req.body);   
  
});


app.post("/login", (req, res)=> {
    
    const { email, password} = req.body
    User.findOne({ email: email}, async (err, user) => {
        if(user) {
            if (password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            // Register the user
            try {
   
                const { email, name, password } = req.body;
                
                const newUser = new User({ email, name, password});
                await newUser.save();
                
                const token = jwt.sign({ email: newUser.email, password: newUser.password}, secretkey);
                console.log(token)
                const decoded = jwt.decode(token);
              
                console.log("gg1",decoded.password);
                
                res.send({message: "Register Successfull", user: user})
              } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
              }
        }
    })
})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});