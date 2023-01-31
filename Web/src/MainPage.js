import logo from './logo.svg';
import './App.css';

/**
 * @brief Return the home page for AREA
 * This page will be updated soon 
 */
function MainPage() {
    return (
        <div className="App">
        <header className="App-header">
        <b> Welcome </b>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save.
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

export default MainPage;