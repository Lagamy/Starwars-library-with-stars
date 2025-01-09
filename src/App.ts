import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Character from "./pages/Character";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import { WebsiteName } from './constants';

function App(): JSX.Element  {
return (
<div>
<Routes>
    <Route path={`/${WebsiteName}`} element={<Home/>}></Route>
    <Route path={`/${WebsiteName}/:characterId`} element={<Character/>}> </Route>
</Routes>
</div>
 );
}

export default App;