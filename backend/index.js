const express = require('express');
const cors = require('cors');
const Jwt =require('jsonwebtoken');
const jwtkey='e-com';
const User = require('./db/User');
const Product = require('./db/Product');
const connectDB = require("./db/config");
connectDB(); // Connect to MongoDB
const app=  express();
app.use(express.json());
const corsOptions = {
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
};
app.use(cors(corsOptions));



app.post("/signup", async (req, resp) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject(); // Convert to plain JavaScript object to delete password
        delete result.password; // Remove password field from the result object

        Jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                resp.status(500).send({ message: "Something went wrong, please try again later." });
            }
                resp.status(200).send({ result, auth: token });
            
        });
    } catch (error) {
        resp.status(500).send({ message: "Error during signup. Please try again." });
    }
});


app.post("/login",async (req,resp)=>{
    if(req.body.email && req.body.password)
    {
   let user = await User.findOne(req.body).select("-password");
    if(user)
    {
        Jwt.sign({user}, jwtkey,{expiresIn: "2h"},(err, token) =>{
            if(err){
                resp.send({result:"something went wrong, please try after sometime"});
            }else{
                resp.send({user,auth:token});
            }
        })
        

    }else{
        resp.send({user:"No user found"});
    }
    }else{
        resp.send({user:"No user found"});
    }
})


app.post("/add-product",verifyToken,  async (req, resp) => {
    try {
        let product = new Product(req.body);
        let result = await product.save();
        resp.status(201).send(result); // Status 201 for successful creation
    } catch (error) {
        console.error(error); // Optionally log the error for debugging
        resp.status(500).send({ message: "An error occurred while adding the product", error: error.message });
    }
});

app.get("/products", verifyToken, async (req, resp) => {
   
        let products = await Product.find();
        if(products.length>0)
        {
            resp.send(products)
        }else
        {
            resp.send("No Product Found")
        }
        
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
    try {
      // Ensure you're working with the correct type of `id`
      const productId = req.params.id;
  
      const result = await Product.deleteOne({ _id: productId });
  
      // If no documents were deleted, return 404 or some other error message
      if (result.deletedCount === 0) {
        return resp.status(404).json({ message: "Product not found" });
      }
  
      // Send success response
      resp.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      resp.status(500).json({ message: "Failed to delete product", error: err.message });
    }
  });


  app.get("/get-product/:id", verifyToken, async (req, resp) => {
   
    let result = await Product.findOne({_id:req.params.id});
    if(result)
    {
        resp.send(result)
    }else
    {
        resp.send("No Product Found")
    }
    
});

app.put("/update-product/:id",verifyToken, async (req, resp) => {
    try {
        // Perform the update operation
        let result = await Product.updateOne(
            { _id: req.params.id }, // The filter
            { $set: req.body } // The update operation
        );

        // Send the result back to the client
        resp.send(result);
    } catch (error) {
        // Handle errors if any
        resp.status(500).send({ message: "Error updating product", error: error.message });
    }
});
app.get("/search/:key", verifyToken ,async(req, resp)=>{
    let result = await Product.find({
        "$or":[
            {name:{ $regex:req.params.key}},
            {company:{ $regex:req.params.key}},
            {price:{ $regex:req.params.key}},
            {category:{ $regex:req.params.key}}
        ]
    });
    resp.send(result)
})

function verifyToken(req, resp, next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        Jwt.verify(token, jwtkey,(err, valid)=>{
            if(err)
            {
                resp.status(401).send({result :  "Plase provide vaild token with header"})
            }else{

                next();
            }
        })

    }else{

        resp.status(403).send({result :  "Plase add token with header"})
}
    }


app.listen(5000);