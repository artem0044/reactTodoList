import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header';
import CreateButton from './components/CreateButton/CreateButton';
import ListsContainer from './components/ListsContainer/ListsContainer';
import { Provider } from 'react-redux';
import store from './store';
import CreateListIcon from './components/createListIcon/createListIcon';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <CreateListIcon />
        <ListsContainer />
      </Provider>
    </div>
  );
}

export default App;
