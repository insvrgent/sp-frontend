// SpotifyLogin.js
import React from 'react';
import { useHistory } from 'react-router-dom';

function SpotifyLogin() {
  const history = useHistory();

  const handleLogin = () => {
    // Redirect user to Spotify login page
    window.location.href = 'http://localhost:5000/login'; // Your backend login endpoint
  };

  return (
    <div>
      <h2>Login to Spotify</h2>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
}

export default SpotifyLogin;
