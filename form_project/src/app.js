const express = require ("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')
const session = require('express-session')
const passport = require("passport")
const LocalStrategy = require("passport-local")


app.use(session({secret: 'keyboard cat',resave: false,saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    if (user) {return done(null,"devflex")}
    return(null,false)
});

passport.deserializeUser(function(username, done) {Admin.findOne({username:username},(err,user)=>{
            if(err) return done(null,false)
            return done (null,user) })
});

function isAuthenticated(req,res,done){
    if (req.user) {return done()}
    return res.redirect("/admin");
}

passport.use(new LocalStrategy( function(username, password, done) {
      Admin.findOne({ username:username}, function (err, user) {
        // console.log(user)
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));


app.use(fileUpload({useTempFiles:true}))


require("./db/conn");
const Register = require("./models/registers");
const Haath = require("./models/haathData");
const Category = require("./models/categoryData");
const Admin = require("./models/admin");
const e = require("express");
const { Console } = require("console");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);



//update data
cloudinary.config({cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY,  api_secret: process.env.API_SECRET});

app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.post("/login", (req, res)=>{
    // console.log(req.body);
    Register.findOne({phoneNumber:req.body.phone},function(err,data){
		if(data){
			if(data.password==req.body.password && data.isVerified == true){
				//console.log("Done Login");
				// req.session.userId = data.unique_id;
				//console.log(req.session.userId);
                if (data.hasPaid == true) {
                    res.redirect('/' + req.body.phone +"/paid");
                } else {
                    res.redirect('/' + req.body.phone +"/unpaid");
                }
				
				
			}else if(data.password==req.body.password && data.isVerified == false){
				res.render("unverified");
			}
            else{
                res.send("Password wrong.");
            }
		}else{
			res.send("This Phone No. is not regestered!");
		}
	});
})

app.get("/register", (req, res)=>{

        var ticketArr=[]
        Category.find(function(e2,docs2){
            res.render("register", {newDoc: docs2});
        })
})

app.post("/register", async (req, res)=>{
    Register.findOne({phoneNumber:req.body.phone}, async  function(err,data){
        if(data){
            res.send("Duplicate number found");
            
        }else{
                    
                

            var s = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})
            var link1 = "na"
            var link2 = "na"
            var link3_1 = "na"
            var link3_2 = "na"
            var link4 = "na"
            
            try{
            await cloudinary.uploader.upload(req.files.adf.tempFilePath).then(result=>link1=result.url);
            }catch(e){ console.log(e);}

            try{await cloudinary.uploader.upload(req.files.adb.tempFilePath).then( result=>link2=result.url);
            }catch(e){ console.log(e);}
            if(req.files.tdl){
                try{await cloudinary.uploader.upload(req.files.tdl.tempFilePath).then(result=>link3_1=result.url);    
                }catch(e){console.log(e);}
            }
            if(req.files.td2){
              try{await cloudinary.uploader.upload(req.files.td2.tempFilePath).then(result=>link3_2=result.url);    
              }catch(e){console.log(e);}
            }  
            if(req.files.al){
                try{await cloudinary.uploader.upload(req.files.al.tempFilePath).then( result=>link4=result.url);    
                }catch(e){console.log(e);}
            }    
            // console.log(link1+ " -----" +link2+ " -----" +link3)
            
            Haath.updateOne({id:"6350ceccea83c108ebff933f"}, {$inc : {serialNo: 1}}, function(err){
                
                if(err){
                    console.log(err);
                }
            });
            
        
            try {
                // const password = req.body.password;
                // const cpassword = req.body.repeatPassword;
                let result = s.indexOf(",");
                let time = s.slice(result+2);
                let date = s.slice(0, result);
            


                if(req.body.category === "Pan - 4 Haath - Donation - Rs.2100/Ticket"){
                    const registerData = new Register({
                        phoneNumber: req.body.phone,
                        password: req.body.password,
                        name: req.body.name,
                        co: req.body.co,
                        shopAdd: req.body.sAdd,
                        permaAdd: req.body.pAdd,
                        town: req.body.vill,
                        po: req.body.po,
                        district: req.body.dis,
                        state: req.body.state,
                        pincode: req.body.pin,
                        wNo: req.body.wp,
                        email: req.body.email,
                        category: req.body.category,
                        noOfTicets: 1,
                        price: 2100,
                        aadharFLink: link1,
                        aadharBLink: link2,
                        tradeLicLinkF: link3_1,
                        tradeLicLinkB: link3_2,
                        appreciationLetLink: link4,
                        fillupDate: date,
                        fillupTime: time,
                        serialNo: 0
                    })
                    Category.findOne({name:req.body.category},function(err,data){
                        if(data){
                            Category.updateOne({name:req.body.category}, {ticketsLeft: data.ticketsLeft-1}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            });

                            let cat = req.body.category;
                            let donIndex = cat.indexOf(" - Donation");
                            let slicedCat = cat.slice(0,donIndex);
                            let sNo = slicedCat+" ";

                            Register.updateOne({phoneNumber: req.body.phone}, {serialNo: sNo + ((data.totalTickets) - (data.ticketsLeft) + 1)}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }
                    });
                    // console.log(registerData)
                    const registeredD = await registerData.save();
                    // console.log(registeredD)
                    // res.status(201).redirect("/login");
                    res.status(201).render("unverified");
                }
                else if(req.body.category === "Cloth - 8 Haath - Donation - Rs.4100/Ticket" || 
                        req.body.category === "Bag - 8 Haath - Donation - Rs. 4100/Ticket" ||
                        req.body.category === "Dry Sweets - 8 Haath - Donation - Rs.4100/Ticket" ||
                        req.body.category === "Stationary - 8 Haath - Donation - Rs.4100/Ticket" ||
                        req.body.category === "Shoes - 8 Haath - Donation - Rs.4100/Ticket" ||
                        req.body.category === "Hotal - 8 Haath - Donation - Rs. 4100/Ticket" ||
                        req.body.category === "Iron and Trunk - 8 Haath - Donation - Rs. 4100/Ticket"){

                    const registerData = new Register({
                        phoneNumber: req.body.phone,
                        password: req.body.password,
                        name: req.body.name,
                        co: req.body.co,
                        shopAdd: req.body.sAdd,
                        permaAdd: req.body.pAdd,
                        town: req.body.vill,
                        po: req.body.po,
                        district: req.body.dis,
                        state: req.body.state,
                        pincode: req.body.pin,
                        wNo: req.body.wp,
                        email: req.body.email,
                        category: req.body.category,
                        noOfTicets: 1,
                        price: 4100,
                        aadharFLink: link1,
                        aadharBLink: link2,
                        tradeLicLinkF: link3_1,
                        tradeLicLinkB: link3_2,
                        appreciationLetLink: link4,
                        fillupDate: date,
                        fillupTime: time,
                        serialNo: 0
                    })
                    Category.findOne({name: req.body.category},function(err,data){
                        if(data){
                            Category.updateOne({name: req.body.category}, {ticketsLeft: data.ticketsLeft-1}, function(err){
                                if(err){
                                    console.log(err);
                                }
                                
                            });

                            let cat = req.body.category;
                            let donIndex = cat.indexOf(" - Donation");
                            let slicedCat = cat.slice(0,donIndex);
                            let sNo = slicedCat+" ";

                            Register.updateOne({phoneNumber: req.body.phone}, {serialNo: sNo + ((data.totalTickets) - (data.ticketsLeft) + 1)}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }

                    });
                    // console.log(registerData)
                    const registeredD = await registerData.save();
                    // console.log(registeredD)
                    res.status(201).render("unverified");
                }
                else if(req.body.category === "Others - 4 Haath - Donation - Rs.1100/Ticket"){

                    const registerData = new Register({
                        phoneNumber: req.body.phone,
                        password: req.body.password,
                        name: req.body.name,
                        co: req.body.co,
                        shopAdd: req.body.sAdd,
                        permaAdd: req.body.pAdd,
                        town: req.body.vill,
                        po: req.body.po,
                        district: req.body.dis,
                        state: req.body.state,
                        pincode: req.body.pin,
                        wNo: req.body.wp,
                        email: req.body.email,
                        category: req.body.category,
                        noOfTicets: 1,
                        price: 1100,
                        aadharFLink: link1,
                        aadharBLink: link2,
                        tradeLicLinkF: link3_1,
                        tradeLicLinkB: link3_2,
                        appreciationLetLink: link4,
                        fillupDate: date,
                        fillupTime: time,
                        serialNo: 0
                    })
                    Category.findOne({name: req.body.category},function(err,data){
                        if(data){
                            Category.updateOne({name: req.body.category}, {ticketsLeft: data.ticketsLeft-1}, function(err){
                                if(err){
                                    console.log(err);
                                }
                                
                            });

                            let cat = req.body.category;
                            let donIndex = cat.indexOf(" - Donation");
                            let slicedCat = cat.slice(0,donIndex);
                            let sNo = slicedCat+" ";

                            Register.updateOne({phoneNumber: req.body.phone}, {serialNo: sNo + ((data.totalTickets) - (data.ticketsLeft) + 1)}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }

                    });
                    // console.log(registerData)
                    const registeredD = await registerData.save();
                    // console.log(registeredD)
                    res.status(201).render("unverified");
                }
                else if(req.body.category === "Others - 6 Haath - Donation - Rs.1600/Ticket"){

                    const registerData = new Register({
                        phoneNumber: req.body.phone,
                        password: req.body.password,
                        name: req.body.name,
                        co: req.body.co,
                        shopAdd: req.body.sAdd,
                        permaAdd: req.body.pAdd,
                        town: req.body.vill,
                        po: req.body.po,
                        district: req.body.dis,
                        state: req.body.state,
                        pincode: req.body.pin,
                        wNo: req.body.wp,
                        email: req.body.email,
                        category: req.body.category,
                        noOfTicets: 1,
                        price: 1600,
                        aadharFLink: link1,
                        aadharBLink: link2,
                        tradeLicLinkF: link3_1,
                        tradeLicLinkB: link3_2,
                        appreciationLetLink: link4,
                        fillupDate: date,
                        fillupTime: time,
                        serialNo: 0
                    })
                    Category.findOne({name: req.body.category},function(err,data){
                        if(data){
                            Category.updateOne({name: req.body.category}, {ticketsLeft: data.ticketsLeft-1}, function(err){
                                if(err){
                                    console.log(err);
                                }
                                
                            });

                            let cat = req.body.category;
                            let donIndex = cat.indexOf(" - Donation");
                            let slicedCat = cat.slice(0,donIndex);
                            let sNo = slicedCat+" ";

                            Register.updateOne({phoneNumber: req.body.phone}, {serialNo: sNo + ((data.totalTickets) - (data.ticketsLeft) + 1)}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }

                    });
                    // console.log(registerData)
                    const registeredD = await registerData.save();
                    // console.log(registeredD)
                    res.status(201).render("unverified");
                }
                else{
                    const registerData = new Register({
                        phoneNumber: req.body.phone,
                        password: req.body.password,
                        name: req.body.name,
                        co: req.body.co,
                        shopAdd: req.body.sAdd,
                        permaAdd: req.body.pAdd,
                        town: req.body.vill,
                        po: req.body.po,
                        district: req.body.dis,
                        state: req.body.state,
                        pincode: req.body.pin,
                        wNo: req.body.wp,
                        email: req.body.email,
                        category: req.body.category,
                        noOfTicets: 1,
                        price: 3100,
                        aadharFLink: link1,
                        aadharBLink: link2,
                        tradeLicLinkF: link3_1,
                        tradeLicLinkB: link3_2,
                        appreciationLetLink: link4,
                        fillupDate: date,
                        fillupTime: time,
                        serialNo: 0
                    })
                    Category.findOne({name: req.body.category},function(err,data){
                        if(data){
                            Category.updateOne({name: req.body.category}, {ticketsLeft: data.ticketsLeft-1}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            });

                            let cat = req.body.category;
                            let donIndex = cat.indexOf(" - Donation");
                            let slicedCat = cat.slice(0,donIndex);
                            let sNo = slicedCat+" ";
                            // console.log(sNo);

                            Register.updateOne({phoneNumber: req.body.phone}, {serialNo: sNo + ((data.totalTickets) - (data.ticketsLeft) + 1)}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            })
                        }
                    });
                    // console.log(registerData)
                    const registeredD = await registerData.save();
                    // console.log(registeredD)
                    

                    res.status(201).render("unverified");
                }
                // Haath.findOne({id:"6350ceccea83c108ebff933f"},function(err,data){
                //     if(data){
                //         Register.updateOne({ phoneNumber: req.body.phone}, {serialNo: data.serialNo}, function(err){
                //             if(err){
                //                 console.log(err);
                //             }
                            
                //         });
                        
                    
                //     }
                // });
                
                // console.log(registerData)
                // const registeredD = await registerData.save();
                // console.log(registeredD)
                // res.status(201).redirect("/login");

            } catch (error) {
                // console.log(error);
                if(error.code === 11000){
                    res.send("Duplicate Phone no. found");
                }
                // res.status(400).send(error);
            }
        }
    });
})

app.get("/:phone/unpaid", (req, res)=>{

    Register.findOne({phoneNumber:req.params.phone},function(err,data){
		if(data){
            if (data.isVerified == true) {
                res.render("verifiedUnpaid", {thisPersonData: data});
            } else {
                res.redirect("/login");
            }
		}else{
			res.redirect("/");
		}
	});
})

app.get("/:phone/paid", (req, res)=>{
    // console.log(req.params.phone);
    Register.findOne({phoneNumber:req.params.phone},function(err,data){
		if(data){
			if (data.hasPaid == true) {
                res.render("verifiedPaid");
            } else {
                res.redirect("/login");
            }
		}else{
			res.send("This Phone No. is not regestered!");
		}
	});
})

app.get("/admin", (req, res)=>{
    res.render("loginAdmin");
})
app.post("/admin",passport.authenticate('local'),(req,res)=>{
    // console.log(req.body)
    res.redirect("/admin/lists")
})

app.get("/admin/lists",isAuthenticated, (req, res)=>{
    res.render("adminLanding");
})

// pending forms from here

app.get("/admin/lists/pending",isAuthenticated, (req, res)=>{
    // let pendingForms;
    Register.find({isVerified:false},function(err,data){
        if(data){
            // console.log(data);
            res.render("pending", {pendingForms: data});
        }
        else{
            res.send("all verified");
        }
    });
})

app.get("/admin/lists/data/:phone",isAuthenticated, (req, res)=>{
    let phone = (req.params.phone);
    phone = phone.slice(1, phone.length);
    // console.log(phone);
    Register.findOne({phoneNumber:phone},function(err,data){
        if(data){
            // console.log(data);
            res.render("individualUserData", {pendingIndv: data});
        }
        else{
            res.send("No data found for this user");
        }
    });
})

app.post("/admin/lists/data/:phone",isAuthenticated, (req, res)=>{
    let phone = (req.body.topic);
    // phone = phone.slice(1, phone.length);
    // console.log(req.body.payTopic);

    if(req.body.topic){
        Register.updateOne({phoneNumber:req.body.topic}, {isVerified: true}, function(err){
            if(err){
                res.send("Please retry");
            }
            else{
                res.redirect("/admin/lists/pending/");
            }
        });
    }
    else{
        Register.updateOne({phoneNumber:req.body.payTopic}, {hasPaid: true}, function(err){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/admin/lists/verified/");
            }
        });
    }
    
})

// verified forms from here

app.get("/admin/lists/verified",isAuthenticated, (req, res)=>{
    // let pendingForms;
    Register.find({isVerified:true},function(err,data){
        if(data){
            // console.log(data);
            res.render("pending", {pendingForms: data});
        }
        else{
            res.send("all verified");
        }
    });
})

app.get("/admin/lists/ticketsInfo",isAuthenticated, (req, res)=>{
    // let pendingForms;
    Category.find(function(err,data){
        if(data){
            // console.log(data);
            res.render("ticketsInfo", {ticketInfo: data});
        }
        else{
            res.send("Try again in some time");
        }
    });
})

app.post("/logout",function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/admin');
  });
   
})


app.listen(port, function(){
    console.log(`sever running on port ${port}`);
})

// this is new
