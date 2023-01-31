
import AddArea from './AddAreaPage';
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
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/addArea" element={<AddArea />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
