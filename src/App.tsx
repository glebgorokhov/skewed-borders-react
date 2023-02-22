import React, {useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import Shape from "./Shape";

function App() {
  const content = useRef(null);

  return (
    <div className="App">
      <header className="App-header">

        <div className="content" ref={content}>
          <span className="inner">Content</span>
          <Shape el={content} className="shape" id="mypath" svg corners={[7, [7, 10], 7, [10, 5]]} />
        </div>

        <img src={logo} className="App-logo" alt="logo" />
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
        </a>
      </header>
    </div>
  );
}

export default App;
