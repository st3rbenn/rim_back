import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BsFillSuitHeartFill } from 'react-icons/bs';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Template Typescript using esLint and Prettier Made with {<BsFillSuitHeartFill color='red' />} by{' '}
          <a href='https://www.github.com/st3rbenn' style={{ textDecoration: 'none' }}>
            St3rbenn
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
