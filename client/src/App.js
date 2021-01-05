import React from 'react'
import './styles/app.scss'
import SettingsBar from "./components/SettingsBar";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path='/:id'>
            <Toolbar/>
            <SettingsBar/>
            <Canvas/>
          </Route>
          <Redirect to={`f${(+new Date()).toString(16)}`}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
