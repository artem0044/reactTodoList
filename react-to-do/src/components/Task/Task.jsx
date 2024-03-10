import style from './Task.module.css';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../fetchData';
import { Draggable } from 'react-beautiful-dnd';
import UpdateTaskButton from '../UpdateTaskButton/UpdateTaskButton';
import Moment from 'react-moment';

const Task = ({ content, taskId, date, provided, innerRef }) => {
	const dispatch = useDispatch();

	const deleteTask = () => {
		dispatch(fetchData('DELETE', 'list/deleteTask', `http://localhost:3001/api/deleteTask/${taskId}`)())
			.then(data => console.log(data)).catch(err => console.log(err))
	}


	return (
		<div {...provided.draggableProps} {...provided.dragHandleProps} ref={innerRef} >
			<div className={style.head}>
				<Moment fromNow interval={1000 * 60}>{new Date(date)}</Moment>
				<Button variant="light" onClick={deleteTask}>del</Button>
				<UpdateTaskButton id={taskId} />
			</div>
			<div className={style.task}>{content}</div>
		</div>
	);
}

export default Task;