import express from 'express';
import { ObjectId } from 'mongoose';
import connectToDB from './db.js';
import bodyParser from 'body-parser';
import List from './models/listModel.js';
import Task from './models/todoSchema.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

connectToDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/getLists', async (req, res) => {
    const rawLists = await List.find({});
    const lists = [];

  for (let list of rawLists) {
    const tasks = await Task.find({ listId: list._id });
    tasks.sort((a, b) => a.order - b.order);
    lists.push({ title: list.title, _id: list._id, tasks });
  }

  res.json(lists);
});

app.post('/api/createList', (req, res) => {
  const list = new List({ title: req.body.title });

  console.log(list);
  list.save();
  res.send({ title: list.title, _id: list._id, tasks: [] });
});

app.delete('/api/deleteList/:id', (req, res) => {
  List.findByIdAndDelete(req.params.id)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});


app.get('/api/getTasks', async (req, res) => {
  const allTasks = await Task.find({});
  res.json(allTasks);
});

app.post('/api/createTask', async (req, res) => {
  const { content, listId, date } = req.body;

  const rawList = await List.findOne({ _id: listId });
  const oldListTasks = await Task.find({ listId });
  const task = new Task({ content, listId, date, order: oldListTasks.length });
  await task.save();

  const updatedListTasks = await Task.find({ listId });

  const updatedList = { title: rawList.title, _id: rawList._id, tasks: updatedListTasks }
  res.send(updatedList);
});

app.delete('/api/deleteTask/:taskId', (req, res) => {
  // console.log(req.params)
  Task.findByIdAndDelete(req.params.taskId)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

app.put('/api/updateTask', (req, res) => {
  console.log(req.body);
  Task.findOneAndUpdate({ _id: req.body.id }, { content: req.body.content, date: req.body.date, listId: req.body.listId }, { new: true })
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

app.put('/api/updateTaskOrder', async (req, res) => {
  const { taskId, listId, index, sourceListId } = req.body;
  const task = await Task.findOne({ _id: taskId });
  const tasks = await Task.find({ listId });
  tasks.sort((a, b) => a.order - b.order);
  const updatedLists = [];

  if (listId === sourceListId) {

    const oldIndx = tasks.findIndex(obj => obj._id.valueOf() === task._id.valueOf());

    tasks.splice(oldIndx, 1);
    tasks.splice(index, 0, task);

    for (let i = 0; i < tasks.length; i++) {
      await Task.findOneAndUpdate({ _id: tasks[i]._id }, { order: i });
    }


    const rawList = await List.findOne({ _id: listId });
    const updTasks = await Task.find({ listId });
    updTasks.sort((a, b) => a.order - b.order);

    res.send([{ ...rawList, tasks: updTasks }]);
    return;
  }

  tasks.splice(index, 0, task);

  for (let i = 0; i < tasks.length; i++) {
    console.log(tasks[i], '--', i);
    await Task.findOneAndUpdate({ _id: tasks[i]._id }, { order: i, listId, });
  }

  const rawLists = await List.find({
    '_id': {
      $in: [
        listId,
        sourceListId,
      ]
    }
  });


  for (let list of rawLists) {
    const tasks = await Task.find({ listId: list._id });
    tasks.sort((a, b) => a.order - b.order);
    updatedLists.push({ title: list.title, _id: list._id, tasks });
  }


  res.send(updatedLists);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening port ${PORT}`)
});