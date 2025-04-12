const mongoose = require("mongoose");
const Users = require("../models/Users");


exports.createUser=async(req,res)=>{
    try{
        const {name, phone, email, image } =req.body

        if(!name || !phone || !email || !image)
        {
            res.status(400).json({ message: "All fields are required" });
        }

        const newUser = new Users({
            name,
            phone,
            email,
            image,
            created:Date.now()
        })

        const savedUser = await newUser.save()
        res.status(201).json({ message: "User created successfully", user: savedUser });

    }
    catch(error)
    {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    
    }
}