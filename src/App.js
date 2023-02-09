import './App.css';
import { MainApp } from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<MainApp />} />
        </Routes>
        <Routes>
          <Route exact path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
