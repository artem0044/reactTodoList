import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    content: String,
    listId: String,
    date: Number,
    order: Number,
});

export default mongoose.model('task', taskSchema);