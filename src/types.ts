import { CSSProperties } from 'react';
  export type CharacterType = {
    name: string;
    films: string[];
    starships: string[];
    skin_color: string;
    hair_color: string;
    eye_color: string;
    url: string
  };

  export type StarshipType = {
    name: string;
    url: string
  };

  export type FilmType = {
    title: string;
    episode_id: number;
    starships: string[];
    url: string
  };

  
  export type StarsBackground = { 
    Class: string;
    Weight: number;
    Size: number;
    paralaxSpeed: number; 
    Id: string;
    IgnoreScroll: boolean; 
    ReactFlow: boolean;
  }

  export type Star = { 
    Top: number; 
    Left: number;
    Color: string;
    Id: string;
  }

  export type CSSProps = CSSProperties &  Record<string, string> // Allows additional properties that are not built-in. Alternatively instead of Record<string, string> - [key: string]: string can be used here for more manuall declaration.