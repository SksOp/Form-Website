const mongoose = require("mongoose");
//insert url
mongoose.connect(process.env.DB_URL, {
}).then(()=>{
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})

