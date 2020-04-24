import React from "react";
import "./App.css";
import LandingPage from '../src/components/LandingPage/LandingPage';
import {GamePage} from '../src/containers/GamePage/GamePage';
import {Route , Switch } from 'react-router-dom'; 


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/game" component={GamePage}/>
        <Route path="/" component={LandingPage}/>
      </Switch>
    </div>
  );
}

export default App;
