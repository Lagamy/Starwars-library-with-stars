import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Character from "./pages/Character";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'

function App() {
  
return (
<div>
<Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/:characterId" element={<Character/>}> </Route>
</Routes>
</div>
 );
}

export default App;