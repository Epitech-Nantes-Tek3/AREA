/**
 * @module App
 */
import AddArea from './AddAreaPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react';
import { ip } from './serverIP'

/**
 * @brief Main Function for AREA App
 */
function App() {
  const [userInformation, setUserInformation] = useState({
    mail: "",
    locationAccept: false,
    coord: {
        latitude: 0,
        longitude: 0,
        city: ""
    },
    id: "",
    services: {
        spotifyId: "",
        googleId: "",
        twitterId: "",
        twitchId: "",
        stravaId: ""
    },
    ip: ip
  });

  const [allAreas, setAllAreas] = useState([])



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage allAreas={allAreas} setAllAreas={setAllAreas} userInformation={userInformation} setUserInformation={setUserInformation} />}/>
        <Route path="/auth" element={<AuthPage allAreas={allAreas} setAllAreas={setAllAreas} userInformation={userInformation} setUserInformation={setUserInformation} />} />
        <Route path="/addArea" element={<AddArea allAreas={allAreas} setAllAreas={setAllAreas} userInformation={userInformation} setUserInformation={setUserInformation} />} />
        <Route path="/home" element={<HomePage allAreas={allAreas} setAllAreas={setAllAreas} userInformation={userInformation} setUserInformation={setUserInformation} />} />
        <Route path="/settings" element={<SettingsPage allAreas={allAreas} setAllAreas={setAllAreas} userInformation={userInformation} setUserInformation={setUserInformation} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
