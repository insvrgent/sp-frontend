import React from 'react';
import Login from './Login';
import Finder from './Finder';

const App = () => {
  return (
    <div>
      {!sessionStorage.getItem('accessToken') ? (<Login/>) : (<Finder/>)}
    </div>
  );
};

export default App;
