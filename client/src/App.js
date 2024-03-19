import React, {useState, useEffect} from 'react';
import Stats from './components/stats';

function App() {

  const [charactersList, setCharactersList] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState({});
  const [characterStats, setCharacterStats] = useState({});

  const [loadingStats, setLoadingStats] = useState(false);

  function updateSelectedCharacter(event) {
    setSelectedCharacter(charactersList.find(character => character.character === event.target.value));
  }

  // fetch characters and urls
  useEffect(() => {
    fetch('/api').then(
      response => response.json()
    ).then(
      data => {
        setCharactersList(data);
      }
    );
  }, []);


  useEffect(() => {
    // console.log('selectedCharacter.url: ', selectedCharacter.url);
    let charNameURL = JSON.stringify(selectedCharacter.url);
    charNameURL = charNameURL?.substring(charNameURL.lastIndexOf('/') + 1, charNameURL.length - 1);
    // console.log('charNameURL:', charNameURL);
    setLoadingStats(true);
    fetch(`/stats?character=${charNameURL}`).then(
      response => response.json()
    ).then(
      data => {
        setCharacterStats(data);
        setLoadingStats(false);
      }
    );
  }, [selectedCharacter])

  return (
    <div>

      {(!charactersList) ? (
        <p>Loading</p>
      ) : (
        <div className='App'>
          <h1>Honkai: Star Rail Character Stats</h1>

          <label htmlFor="characters">Choose a character: </label>
          <select onChange={updateSelectedCharacter} name="characters" id="characters" defaultValue="">
            <option value="" disabled hidden>Choose here</option>
            {charactersList.map((character, i) => (
              <option key={i} value={character.character}>{character.character}</option>
            ))}
          </select>
          
          {(!(selectedCharacter.character)) ? (
            <p>Select a character to get stats</p>
          ) : (loadingStats ? <h3>Loading...</h3> :
            <Stats
              selectedCharacter={selectedCharacter.character}
              stats={characterStats}
            />
          )}

        </div>
      )}

    </div>
  )
}

export default App