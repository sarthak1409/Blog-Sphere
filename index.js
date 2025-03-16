const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mysql = require('mysql2');

// const {v4 : uuidv4} = require('uuid'); 
const method_override = require("method-override");
app.use(method_override("_method"));

app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.listen(port,()=>{
    console.log("Listening to port",port);
});
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'DBMS',
    password: 'Sarthak@1409'
  });
  app.get("/",(req,res)=>{
    let q = "SELECT COUNT(*) FROM Insta"; 
     try{
    connection.query(q,(err,result)=>{
        if (err) throw err;
        let count=result[0]['COUNT(*)'];
        res.render("main.ejs");
        // res.send();
        // res.send(`The service is working at well There Are Total ${count} Users`);
        // console.log(result);
      });
   }catch(err){
    res.send("some error in database");
   }
    // res.send("Welcome to home page!");
  });
  app.get("/user",(req,res)=>{ 
    let q = "SELECT * FROM Insta";
    try{
      connection.query(q,(err,users)=>{
          if (err) throw err;
        // res.send("working");
          res.render("index.ejs",{users:users , loggedIn : true});
        // console.log(result);
          // res.render("home.ejs",{count});
        });
    }catch(err){ 
      res.send("some error in database");
      console.log(err);
     }
   
  });

  app.get("/user/login",(req,res)=>{
    res.render("login.ejs");
  });
  app.get("/user/register",(req,res)=>{
    res.render("signup.ejs");
  });
  // app.post()
  app.post("/user/register",(req,res)=>{
    let {username,password, email } = req.body;
    let q = `INSERT INTO user VALUES ('${username}','${password}','${email}')`;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let register = { password: password, username: username , email : email }; 
          // console.log(user);
          res.redirect("/user/login");
        });
     }catch(err){
      res.send("some error in database");
     }
    });
    app.post("/user/login", (req, res) => {
      let { username, password } = req.body;
  
      let q = `SELECT * FROM user WHERE username = ?`;
      connection.query(q, [username], (err, result) => {
          if (err) {
              console.error("Database error: ", err);
              res.send("Database error");
              return;
          }
  
          if (result.length === 0) {
              console.log("No user found with username: " + username);
              res.render("error.ejs");
              return;
          }
  
         
          let loger = result[0];
  
          
          console.log("Entered password: " + password);
          console.log("Stored password: " + loger.password);
  
          
          if (password !== loger.password) {
              console.log("Password mismatch");
             
              res.render("error.ejs");
          } else {
              console.log("Password correct");
            
              res.redirect("/user");
          }
      });
  });
  
  
   


  app.get("/user/:username/edit",(req,res)=>{
    let {username}=req.params;
    let q = `SELECT * FROM Insta WHERE username = '${username}'`;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user = result[0];
          res.render("edit.ejs",{user});
        });
     }catch(err){
      res.send("some error in database");
     }
   
  });
  
  app.patch("/user/:username",(req,res)=>{
    let {username}=req.params;
    let q = `SELECT * FROM Insta WHERE username = '${username}'`;
    let {password : formPass , caption:newCaption}=req.body;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user = result[0];
          if(formPass != user.password){
            res.render("error.ejs");
          }else{
            const query = `UPDATE Insta SET caption="${newCaption}" WHERE username="${username}"`;
            connection.query(query,(err,result)=>{
              if (err) throw err;
              res.redirect("/user");
            });
          }
    });
     }catch(err){
      res.send("some error in database");
     }
  })





  app.get("/user/:username/delete",(req,res)=>{
    let {username}=req.params;
    let q = `SELECT * FROM Insta WHERE username = '${username}'`;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user = result[0];
          res.render("delete.ejs",{user});
          // res.send("Working");
        });
     }catch(err){
      res.send("some error in database");
     }
   
  });
  
  app.delete("/user/:username",(req,res)=>{
    let {username}=req.params;
    let q = `SELECT * FROM Insta WHERE username = '${username}'`;
    let {password : formPass , username:formUsername}=req.body;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user = result[0];
          if(formPass != user.password || formUsername != user.username){
            res.render("error.ejs");
          }else{
            const query = `DELETE FROM Insta WHERE username="${username}"`;
            connection.query(query,(err,result)=>{
              if (err) throw err;
              // console.log(formUsername,user.username,user.password,formPass);
              res.redirect("/user");
            });
          }
    });
     }catch(err){
      res.send("some error in database");
     } 
  }) 

  app.get("/user/:username",(req,res)=>{
    let {username}=req.params;
    let q = `SELECT * FROM Insta WHERE username = '${username}'`;
    try{
      connection.query(q,(err,result)=>{
          if (err) throw err;
          user=result[0];
          // console.log(user);
          res.render("users.ejs",{user}); 
          // res.send("Working");
        });
     }catch(err){
      res.send("some error in database");
     }
   
  })
app.get("/add",(req,res)=>{
  res.render("new.ejs");
});
// app.post("/user",(req,res)=>{
//   let {username,caption,password,followers,following,skills,qualification,likes,post_no}=req.body;
//   let q = `INSERT INTO Insta VALUES ("${username}","${caption}","${followers}","${following}","${likes}","${password}","${skills}","${qualification}","${post_no}")`;
//   try{
//     connection.query(q,(err,result)=>{
//         if (err) throw err;
//         res.redirect("/user");
//         // res.send("Working"); 
//       });
//    }catch(err){
//     res.send("some error in database");
//    }

// });
app.post("/user", (req, res) => {
  const { username, caption, password, followers, following, skills, qualification, likes, post_no } = req.body;

  const values = [
    username,
    caption,
    followers || 0,         // Set default to 0 if empty
    following || 0,
    likes || 0,
    password,
    skills || "None",
    qualification || "Not specified",
    post_no || 0
  ];

  const query = "INSERT INTO Insta (username, caption, followers, following, likes, password, skills, qualification, post_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(query, values, (err) => {
    if (err) {
      console.error(err);
      return res.send("Database error.");
    }
    res.redirect("/user");
  });
});

