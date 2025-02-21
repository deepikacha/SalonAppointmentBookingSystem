require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const adminRoutes = require('./routes/admin/adminRoutes');
const userRoutes = require('./routes/user/userRoutes');
const employeeRoutes=require('./routes/admin/employeeRoutes');
const cors=require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you need to send cookies or authorization headers
}));
app.use("/admin",adminRoutes);
app.use(userRoutes);
app.use(employeeRoutes);

async function initialize(){
 await sequelize.sync(
 
 // {alter:true}
  )
 
   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  

})
}
initialize();
