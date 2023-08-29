import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'
import Home from './components/Home';


function App() {


  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={withRouter(Login)} />
          <Route exact path='/home' component={withRouter(Home)} />
        </Switch>
      </BrowserRouter>
    </>


  );
}

export default App;