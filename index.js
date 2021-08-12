const fastify = require('fastify')()

fastify.register(require('fastify-cors'),{
})

const mongoose = require('mongoose');


const nodemailer = require("nodemailer");
var otpGenerator = require('otp-generator')

mongoose.set('useFindAndModify', false);

try {
    mongoose.connect('mongodb+srv://admin:admin123@mycluster.n4gnk.mongodb.net/AngularBlog?retryWrites=true&w=majority', { useNewUrlParser: true.valueOf, useUnifiedTopology: true });
    console.log("db connected");
} catch (e) {
    console.error(e);
}

const blogschema = require('./models/BlogData'); //new schema


//new schema
fastify.post('/postItems', async (request, reply) => {
    console.log(request.body);
    const {name,mail,blogimg,photo,type,like,dlike,title,des}=request.body;
    const obj = {
       Name:name,
       Email:mail,
       Blogimg:blogimg,
       Photo:photo,
       Type:type,
       Like:like,
       Dislike:dlike,
       Title:title,
       Description:des,
       privateUsers:[]
    }
    console.log(obj);

    try {
        const newBlog = await blogschema.create(obj);
        reply.code(201).send(newBlog);

    } catch (e) {
        reply.code(500).send(e);
    }

    reply.send(items);

})

//new schema
fastify.get('/getItems', async (request, reply) => {
    try {
        const blogdetails = await blogschema.find({});
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

//new schema
fastify.get('/getMyitems', async (request, reply) => {
    console.log(request.query.mail)
    //reply.send(request.body);
     try {
         const blogdetails = await blogschema.find({Email:request.query.mail});
         reply.code(200).send(blogdetails);
       } catch (e) {
         reply.code(500).send(e);
    }
})

fastify.get('/getSingleItems', async (request, reply) => {
  const id = request.query.id
//    console.log(id)
//     reply.send(id);
   try {
       const blogdetails = await blogschema.findOne({_id:id});
       // console.log(blogdetails)
       reply.code(200).send(blogdetails);
     } catch (e) {
       reply.code(500).send(e);
  }
   
})

fastify.put('/updateItems', async (request, reply) => {
    const {Name,Email,Blogimg,Photo,Type,Like,Dislike,Title,Description}=request.body
    try {
        console.log(request.body)
        const obj = {
            Name:Name,Email:Email,Blogimg:Blogimg,Photo:Photo,Type:Type,Like:Like,Dislike:Dislike,Title:Title,Description:Description
         }
        const blogdetails = await blogschema.findByIdAndUpdate(request.body._id, { $set: obj}, {new:true})
        console.log(blogdetails)
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

fastify.delete('/deleteItems', async (request, reply) => {
    try {
        const blogdetails = await blogschema.findByIdAndRemove(request.query.id, {new:true,useFindAndModify:false})
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'testingusers0830@gmail.com',
      pass: 'test@0830'
    }
})
  
otp = ""
  
function generateOTP(){
    otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    return otp;
}
  
  
fastify.get("/sendmail",function(req,res){
    console.log("emailpart" , req.query.mail);
    let currOTP = generateOTP();
    let mailOptions = {
      to: req.query.mail,
      subject: "OTP for Your requested Blog",
      html: `<h1>Your OTP for BLOGGING is</h1><p>`+currOTP+`</p>`
    };
    transporter.sendMail(mailOptions, function(err,data){
      if(err){
        res.send({success:false});
      }
      else{
        console.log("success");
        res.send({success:true});
      }
    })
})
  
fastify.post('/verify',async function(req,res){
    console.log(otp,req.body.otp);
    console.log(req.body);
    if(otp===req.body.otp){
        try {
            const blogdetails = await blogschema.findById(req.body.blogid);
            let userarray = blogdetails.privateUsers;
            userarray.push(req.body.user);

            try{
                await blogschema.findByIdAndUpdate(req.body.blogid, { $set: {"privateUsers":userarray}}, {new:true})
            }
            catch(e){
                res.send({success:false});
            }
            
          } catch (e) {
            res.send({success:false});
        }
        res.send({success:true});
    }
    else{
      res.send({success:false});
    }
    
})

fastify.listen(process.env.PORT, '0.0.0.0', err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})