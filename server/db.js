import mongoose from "mongoose";

const connectToDB = () => {
  mongoose.connect('mongodb+srv://myUser:userPassword@drugcluster.qamnccl.mongodb.net/?retryWrites=true&w=majority&appName=drugCluster')
    .then(() => console.log('Connect to DB'))
    .catch(err => console.log(err));
}

export default connectToDB;