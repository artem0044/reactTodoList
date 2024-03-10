import { useCallback } from 'react';
import Task from '../Task/Task';
import style from './List.module.css';
import Button from 'react-bootstrap/Button';
import { fetchData } from '../../fetchData.js';
import { useDispatch, useSelector } from 'react-redux';
import CreateTaskIcon from '../CreateTaskIcon/CreateTaskIcon';
import { Draggable } from 'react-beautiful-dnd';

const List = ({ title, listId, provided, innerRef, tasks }) => {
  const dispatch = useDispatch();

  const deleteList = useCallback(
    () => dispatch(fetchData('DELETE', 'list/deleteList', `http://localhost:3001/api/deleteList/${listId}`)()),
    [],
  )



  return (
    <div className={style.List}>
      <div className={style.head}>
        <h4>{title}</h4>
        <div>
          <CreateTaskIcon listId={listId} />
          <Button variant="light" onClick={deleteList}>del</Button>
        </div>
      </div>

      <div className={style.taskQueue}  {...provided.draggableProps} {...provided.dragHandleProps} ref={innerRef} >
        {tasks.map(({ content, _id, date }, index) => (
          <Draggable key={_id} draggableId={`${listId} ${_id}`} index={index}>
            {(provided) => (
              <Task
                innerRef={provided.innerRef}
                provided={provided}
                content={content}
                taskId={_id}
                date={date}
                order={index}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div >
  );
}

export default List;


