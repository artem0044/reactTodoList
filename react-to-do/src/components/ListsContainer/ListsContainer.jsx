import { useEffect, useCallback } from 'react';
import List from '../List/List';
import style from './ListsContainer.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../fetchData.js';
import { reorderTasks } from '../../store/toDoSlice';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { updateTaskOrderAction } from '../../store/actions';

const ListsContainer = () => {
  const dispatch = useDispatch();

  const lists = useSelector((state) => state.toDosList.lists);

  const handleOnDragEnd = useCallback(({ destination, draggableId }) => {
    if (!destination) return;
    const [sourceListId, taskId] = draggableId.split(' ');
    const { droppableId: listId, index } = destination;

    dispatch(reorderTasks({ taskId, sourceListId, destinationListId: listId, index }));
    dispatch(updateTaskOrderAction({ body: JSON.stringify({ taskId, sourceListId, listId, index }) }));
  }, [])

  useEffect(() => {
    dispatch(fetchData('GET', 'list/getLists', 'http://localhost:3001/api/getLists')()).catch(err => console.log(err));
  }, []);

  return (
    <div className={style.ListsContainer}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* {console.log(lists)} */}
        {lists?.map(({ title, _id, tasks }) => (
          <Droppable key={_id} droppableId={_id}>
            {(provided) => {
              return (
                <div>
                  <List innerRef={provided.innerRef} provided={provided} title={title} listId={_id} tasks={tasks} />
                  
                </div>
              )
            }
            }
          </Droppable>
        )
        )}
      </DragDropContext>
    </div >
  );
}

export default ListsContainer;