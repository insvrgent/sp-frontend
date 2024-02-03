import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      // Save refresh token to sessionStorage or localStorage
      sessionStorage.setItem('refreshToken', refreshToken);
      // Clear the tokens from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data); // Assuming data contains the login URL
      window.location.href = data.loginUrl; // Redirect the user to Spotify login
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h1>Spotify Login App</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default App;
