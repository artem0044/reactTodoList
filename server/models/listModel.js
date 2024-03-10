import mongoose from "mongoose"

const listSchema = new mongoose.Schema({
    title: String,
});

export default mongoose.model('List', listSchema);