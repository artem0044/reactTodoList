import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../fetchData.js';


const CreateListIcon = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [error, setError] = useState(false);
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const createList = async (e) => {
    if (text.length > 14 || !text.length) {
      setError(true);
      return;
    };

    dispatch(fetchData('POST', 'list/createList', 'http://localhost:3001/api/createList')({ body: JSON.stringify({ title: text.trim() }) })).then(data => console.log(data));
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
    <div className=" d-flex justify-content-center mt-2 ">
      <Button variant="secondary" onClick={handleShow}>
        Create list
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Enter the title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form  onSubmit={createList} onReset={cancel}>
            <Form.Control className={error ? "border border-danger shadow-none" : ''} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter title" />
            {error && <p className='text-danger'>{(!text.length) ? 'It should not be empty' : 'Must be less than 14 characters'}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Close
          </Button>
          <Button variant="primary" onClick={createList}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateListIcon;