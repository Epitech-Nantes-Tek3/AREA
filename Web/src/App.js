import MainPage from './MainPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom"

/**
 * @brief Main Function for AREA App
 * @returns
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
