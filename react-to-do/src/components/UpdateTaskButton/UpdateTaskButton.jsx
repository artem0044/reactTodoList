import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../fetchData.js';


const UpdateTaskButton = ({ id }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [error, setError] = useState(false);
	const [text, setText] = useState('');
	const dispatch = useDispatch();

	const updateTask = async (e) => {
		if (!text.length) {
			setError(true);
			return;
		};

		dispatch(fetchData('PUT', 'list/updateTask', 'http://localhost:3001/api/updateTask')({ body: JSON.stringify({ content: text.trim(), id, date: new Date().valueOf() }) })).then(data => console.log(data));
		setShow(false);
		setText('');
		setError(false)
	}

	const cancel = () => {
		setShow(false);
		setText('');
		setError(false);
	}

	return (
		<div className=" d-flex justify-content-center  ">
			<Button variant="light" onClick={handleShow}>edit</Button>

			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header >
					<Modal.Title>Enter the text</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form.Control className={error ? "border border-danger shadow-none" : ''} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter task" />
						{error && <p className='text-danger'>It should not be empty</p>}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={cancel}>
						Close
					</Button>
					<Button variant="primary" onClick={updateTask}>Ok</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default UpdateTaskButton;