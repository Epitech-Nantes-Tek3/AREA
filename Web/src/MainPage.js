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
  const [index, setIndex] = useState(-1);

  let areas = [
    {
      "service":
      {
        "name": "spotify",
      },
      "description": "Play a song on Spotify",
    },
    {
      "service":
      {
        "name": "nasa",
      },
      "description": "See NASA",
    },
    {
      "service":
      {
        "name": "twitter",
      },
      "description": "Retweet Elon Musk",
    },
  ]
    function InfoBlock(props) {
      let color = props.index === index ?  "#392D37" : "#D7D7FF";

      function selectIndex() {
        setIndex(props.index);
      }

      return (
        <div style={{
            backgroundColor: color, height: "75%",
            width: 200,
            borderRadius: 20,
            marginRight: 16,
            padding: 10,
            display: "flex",
            flexDirection: "column",}}
          onClick={selectIndex}>
          <div style={{display : "flex"}}>
            <div className='Area-Center' style={{flex : 1}}>
              <img src={logo[props.area.service.name]} alt={props.area.service.name} style={{width: 50, height: 50}} className="Logo-Area"/>
            </div>
            <div className='Area-Center' style={{flex : 1}}>
              <label className='Action-Name'> {props.area.service.name} </label>
            </div>
          </div>
          <div style={{
            flex : 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <label className='Action-Desc'> {props.area.description} </label>
          </div>
        </div>
      )
    }

    return (
        <div style={{
          display: "flex",
          flexDirection: "row",
        }}>
          {
            areas.map((area, index) => {
              return (
                <InfoBlock area={area} index={index}/>
              )
            })
          }
        <InfoBlock area={areas[0]}/>
    </div>
    );
}