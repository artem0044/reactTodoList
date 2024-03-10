import mongoose from "mongoose";

const connectToDB = () => {
  mongoose.connect('mongodb+srv://Artem:qwerty123@cluster0.8j1c1.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connect to DB'))
    .catch(err => console.log(err));
}

export default connectToDB;