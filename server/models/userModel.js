import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String , required:true},
    email: {type:String , required:true, unique : true},
    // MODIFIED: Password is now OPTIONAL to allow Google sign-in
    password: {type:String , required:false}, 
    
    // NEW: Field to store the unique ID from Firebase/Google
    firebaseId: {type:String , unique : true, sparse: true}, 
    
    verifyOtp : {type:String , default:''},
    verifyOtpExpiresAt : {type:Number , default:0},
    isAccountVerified : {type:Boolean , default:false},
    resetOtp : {type:String , default:''},
    resetOtpExpiresAt : {type:Number , default:0},
})

// Ensures the model is not redefined during hot reload
const userModel = mongoose.models.user || mongoose.model('user', userSchema); 

export default userModel;