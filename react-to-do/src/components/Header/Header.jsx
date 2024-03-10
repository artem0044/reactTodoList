import style from './Header.module.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" fixed='sticky'>
      <Container>
        <Navbar.Brand href="#home" >ReactTrello</Navbar.Brand>
        <Navbar.Toggle />

      </Container>
    </Navbar>
  );
}

export default Header;

