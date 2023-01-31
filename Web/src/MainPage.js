import logo from './logo.svg';
import './MainPage.css';
import LogoSpotify from  "./assets/spotify.png"
import LogoIss from "./assets/iss.png"
import LogoStrava from './assets/strava.png';
import LogoTwitch from './assets/twitch.png';
import LogoTwitter from './assets/twitter.png';
import LogoGoogle from './assets/google.png';
import LogoMeteo from './assets/meteo.png';
import LogoNasa from './assets/nasa.png'
import { useState } from 'react';

/**
 * @brief Return the home page for AREA
 * This page will be updated soon
 */
export default function MainPage() {
  let logo = {
    "spotify": LogoSpotify,
    "iss": LogoIss,
    "nasa": LogoNasa,
    "twitter": LogoTwitter,
    "google": LogoGoogle,
    "météo": LogoMeteo,
    "twitch": LogoTwitch,
    "strava": LogoStrava
    }

  let areas = [
    {
      "service":
      {
        "name": "twitter",
      },
      "description": "Play a song on Spotify",
    }
  ]
    function InfoBlock(props) {
      const [color, setColor] = useState("#7D7D7D");

      function changeColor() {
        if (color == "#7D7D7D") {
          setColor("#392D37");
        }
        else {
          setColor("#7D7D7D");
        }
      }

      return (
        <div className='Box-Area' style={{backgroundColor: color}} onClick={changeColor}>
          <div className='Top-Box-Area' style={{}}>
            <div className='Area-Center' style={{flex : 1}}>
              <img src={logo[props.area.service.name]} alt={props.area.service.name} className="Logo-Area"/>
            </div>
            <div className='Area-Center' style={{flex : 1}}>
              <label className='Action-Name'> {props.area.service.name} </label>
            </div>
          </div>
          <div className='Area-Center' style={{flex : 1}}>
            <label className='Action-Desc'> {props.area.description}</label>
          </div>
        </div>
      )
    }

    return (
        <div className="App">
        <InfoBlock area={areas[0]}/>
    </div>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaBox: {
    height: 75%;
    width: 200;
    border-radius: 20;
    margin-right: 16;
    flex-direction: "row";
    border-radius: 10;
  }
});