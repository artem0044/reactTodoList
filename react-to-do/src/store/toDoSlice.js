import { createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../fetchData.js";
import { updateTaskOrderAction } from "./actions.js";
import Task from "../components/Task/Task.jsx";

const initialState = {
  lists: [],
  message: '',
}

const toDoListSlice = createSlice({
  name: 'todosList',
  initialState,
  reducers: {
    reorderTasks(state, { payload: { taskId, sourceListId, destinationListId, index } }) {
      const tasksMap = state.lists.reduce((acc, list) => {
        acc[list._id] = list.tasks;
        return acc;
      }, {});

      const tasks = tasksMap[sourceListId];

      // tasks.sort((a, b) => a - b);
      const task = tasks.find(task => task._id === taskId);

      if (destinationListId === sourceListId) {
        const oldIndx = tasks.findIndex(obj => obj._id.valueOf() === task._id.valueOf());

        tasks.splice(oldIndx, 1);
        tasks.splice(index, 0, task);

        console.log(tasks.forEach(t => console.log(t.order, t.content,)));

        const updTasks = tasks.map((task, index) => {
          task.order = index;
          return task;
        });

        
        updTasks.sort((a, b) => a.order - b.order);
        console.log('UpdTAsks', updTasks.forEach(t => console.log(t.order, t.content,)));

        const rawList = state.lists.find(list => list._id.valueOf() === destinationListId);
        const updList = { ...rawList, tasks: updTasks };

        state.lists = state.lists.map(list => list._id === updList._id ? updList : list);
        return;
      }

      const destinationListTasks = tasksMap[destinationListId];
      destinationListTasks.splice(index, 0, task);


      const updDestinationTasks = destinationListTasks.map((task, index) => {
        task.order = index;
        task.listId = destinationListId;
        return task;
      });

      updDestinationTasks.sort((a, b) => a.order - b.order);

      tasks.splice(index, 1);

      const updSourceTasks = tasks.map((task, index) => {
        task.order = index;
        return task;
      });

      updSourceTasks.sort((a, b) => a.order - b.order);

      const rawLists = state.lists.filter(list => list._id === sourceListId || list._id === destinationListId);
      console.log(rawLists);

      const updLists = rawLists.map(list => ({ ...list, tasks: list._id === sourceListId ? updSourceTasks : updDestinationTasks }));

      const updatedListsMap = updLists.reduce((acc, list) => {
        acc[list._id] = list;
        return acc;
      }, {});

      state.lists = state.lists.map((list) => updatedListsMap[list._id] || list);

      return;
      // console.log(updTasks);
      // updTasks.sort((a, b) => a.order - b.order);

      // const rawList = state.lists.find(list => list._id.valueOf() === destinationListId);
      // const updList = { ...rawList, tasks: updTasks };

      // state.lists = state.lists.map(list => list._id === updList._id ? updList : list);
      // return;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData('GET', 'list/getLists').pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('GET', 'list/getLists').fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchData('GET', 'list/getLists').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchData('POST', 'list/createList').pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('POST', 'list/createList').fulfilled, (state, action) => {
        state.loading = false;
        //  state.lists = [...state.lists, action.payload];
        state.lists.push(action.payload);
        console.log([...state.lists]);
      })
      .addCase(fetchData('POST', 'list/createList').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchData('DELETE', 'list/deleteList',).pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('DELETE', 'list/deleteList').fulfilled, (state, action) => {
        state.loading = false;
        state.lists = state.lists.filter(list => list._id !== action.payload._id);
      })
      .addCase(fetchData('DELETE', 'list/deleteList').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      // CREATE TASK
      .addCase(fetchData('POST', 'list/createTask').pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('POST', 'list/createTask').fulfilled, (state, action) => {
        console.log(action.payload)
        const updatedList = action.payload;
        console.log(updatedList);
        state.loading = false;
        state.lists = state.lists.map((list) => list._id === updatedList._id ? updatedList : list);
      })
      .addCase(fetchData('POST', 'list/createTask').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      // DELETE TASK
      .addCase(fetchData('DELETE', 'list/deleteTask').pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('DELETE', 'list/deleteTask').fulfilled, (state, action) => {
        const deletedTask = action.payload;

        state.loading = false;
        state.lists = state.lists.map((list) =>
          list._id === deletedTask.listId
            ? { ...list, tasks: list.tasks.filter(({ _id }) => _id !== deletedTask._id) }
            : list,
        );
      })
      .addCase(fetchData('DELETE', 'list/deleteTask').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      // UPDATE TASK
      .addCase(fetchData('PUT', 'list/updateTask').pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData('PUT', 'list/updateTask').fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.loading = false;
        state.lists = state.lists.map((list) =>
          list._id === updatedTask.listId
            ? {
              ...list,
              tasks: list.tasks.map((task) => task._id === updatedTask._id ? updatedTask : task)
            }
            : list,
        );
      })
      .addCase(fetchData('PUT', 'list/updateTask').rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      // REORDER TASK
      .addCase(updateTaskOrderAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskOrderAction.fulfilled, (state, action) => {
        console.log(1231232, action.payload)
        const updatedListsMap = action.payload.reduce((acc, list) => {
          acc[list._id] = list;
          return acc;
        }, {});
        state.lists = state.lists.map((list) => updatedListsMap[list._id] || list);
        state.loading = false;
      })
      .addCase(updateTaskOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      });
  },
})

export const { reorderTasks } = toDoListSlice.actions;
export default toDoListSlice.reducer;
