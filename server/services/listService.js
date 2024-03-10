import List from "../models/listModel.js";
import express from "express";
const app = express();

export const listService = {
	getLists: () => {
		app.get('/api/getLists', async (req, res) => {
			const allLists = await List.find({});
			res.json(allLists);
		})
	},

	createList: () => {
		app.post('/api/createList', (req, res) => {
			const list = new List({ title: req.body.title });
			console.log(list);
			list.save();
			res.send(list);
		})
	},

	deleteList: app.delete('/api/deleteList/:id', (req, res) => {
		List.findByIdAndDelete(req.params.id)
			.then(data => res.send(data))
			.catch(err => console.log(err));
	}),
}

