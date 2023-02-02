import MainPage from './MainPage';
import AuthPage from './AuthPage';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
