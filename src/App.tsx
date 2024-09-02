import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserSelector, { User } from './components/UserSelector';

function App() {
  const handleUserSelect = (data: User | User[]) => {
    console.log(data);
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

          user-selector:
          <UserSelector multiple onSelect={handleUserSelect} />
      </header>
    </div>
  );
}

export default App;
