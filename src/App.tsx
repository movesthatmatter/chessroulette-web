import React, { useState } from "react";
import "./App.css";
import LandingPage from '../src/components/LandingPage/LandingPage';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Switch, useLocation, Route, NavLink } from "react-router-dom";
import {GamePage} from '../src/containers/GamePage/GamePage';

function App() {
  const location = useLocation();
  const [transitionClass, setTransitionClass] = useState<string | null>("fade");
  return (
    <div className="App">
      {/* <NavLink to="/" exact><div onClick={()=> {
        setTransitionClass("fade")
      }}>Component1</div></NavLink>
      <NavLink to="/c2"><div onClick={()=> {
        setTransitionClass("fade2")
      }}>Component2</div></NavLink>

       
      <TransitionGroup component={null}>
        <CSSTransition
                key={location.key}
                classNames = {transitionClass as string}
                timeout={1200}
                unmountOnExit
                >
                   <Switch location={location}>
        <Route key="/" exact path="/">
            <div className="fade">
              <C1/>
            </div>
        </Route>
        <Route key="/c2" path="/c2">
            <div className="container">
                    <div className="extra container">
                          <div className = "another container"></div>
                               
                              <div className="fade2">
                                <C2/>
                              </div>
                              <div className="fade2" style={{color : 'white'}}><h2>YES YES YES</h2></div>
            
                        <div className = "another extra container"/>
                  </div>      
          </div>
      
        </Route>
  </Switch>
  </CSSTransition>
      </TransitionGroup> */}
      
      <LandingPage/> 
    </div>
  );
}

const C1 = () => <div style={{color : 'white'}}><h1>Component1</h1></div>

const C2 = () => <div style={{color : 'white'}}><h1>Component2</h1></div>

export default App;
