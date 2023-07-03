const express=require("express")
const app=express()
const port=3000
const mongoose=require("mongoose")
const cors=require("cors")
require("dotenv").config();
const path=require("path")
const cookieParser=require("cookie-parser")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const productRoutes=require("./routes/productRoutes")
const userRoutes=require("./routes/userRoutes")
// const {makePayment}=require('./controller/paymentController')
const {notFound,errorHandler}=require("./middleware/errorMiddleware")

app.use(express.json())
app.use(cors())
app.use(cookieParser())



// makePayment();

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB CONNECTED SUCCESS")
}).catch((err)=>{
    console.log("FAILED TO CONNECT DB",err)
})

// app.get("/api",(req,res)=>{
// //     res.json({
// //         msg:"hello groupsix"
// //     })
// // })



if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/client/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }

  app.use(notFound);
app.use(errorHandler);

app.listen(port,(err)=>{
    if(err) throw new Error("server is asleep...")
console.log(`server running on port ${port}`)
})