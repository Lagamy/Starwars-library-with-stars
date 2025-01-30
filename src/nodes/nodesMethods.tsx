import { type } from "@testing-library/user-event/dist/type";
import { colorDecider, colorTranslator, eyeColorTranslator, filmColorDecider } from "./nodeColorPicker";
import { CharacterType, FilmType, StarshipType } from "../types";
import { Node, Position } from "reactflow";
import { CSSProperties } from 'react';
const min = 200;
const max = 350;
const groupNodeSize = { width: 800, height: 1200 }; // group node size
const padding = 50; // minimum space between nodes to avoid overlap and make it visually pleasing
const canvasWidth = 15000; // maximum width of the canvas
const canvasHeight = 15000; // maximum height of the canvas

    const glowingNodeStyle = (BorderColor: string, TextColor: string): CSSProperties & { [key: string]: string } => //: CSSProperties { [key: string]: string } allows additional properties
    {
        return {
            '--text-color': TextColor,
            '--border-color': BorderColor,
            '--handle-color': BorderColor
        };
    }

    export const createNodeFromCharacter = (character: CharacterType): Node =>{
        // console.log(character);
        let BorderColor = colorDecider(character.skin_color, character.hair_color);
        BorderColor = colorTranslator(BorderColor);
        let TextColor = eyeColorTranslator(character.eye_color);

        let nodeStyle = glowingNodeStyle(BorderColor, TextColor)

        return({
            id: `${character.url}`,
            type: 'input',
            sourcePosition: Position.Right,
            position: {x: 10, y: 0},
            data: { id: character.url, films: character.films, starships: character.starships, strokeColor: TextColor, label: character.name, pressed: true },
            style: nodeStyle, 
        });
    };

    export const createNodeFromFilms = (characterNode: Node, film: FilmType, size: number, index: number): Node =>  {
        // randomised distance between character and his films. Purely visual
        let Color = filmColorDecider(film.episode_id);
        console.log("Film: " + film.episode_id)
        console.log("Color: " + Color);
        let nodeStyle = glowingNodeStyle(Color, Color)
        
        return { 
            id: film.url, 
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            type: 'default',
            position: { x: characterNode.position.x + Math.floor(Math.random() * (max - min + 1)) + min, y: characterNode.position.y - size * 40 + index * 140 }, 
            data: { starships: film.starships, label: film.title, pressed: false, strokeColor: Color },
            style: nodeStyle,
        };
    };


    export const createNodesFromStarships = (filmNode: Node, starships: StarshipType[]): Node[] => {
        
        const filteredStarships = starships.filter(starship => filmNode.data.starships.includes(starship.url));
        const arraySize = filteredStarships.length;
        if(arraySize == 0)
        {
            filmNode.style = { 
                '--handle-color':  'black'
            } as CSSProperties & { [key: string]: string }; 
            filmNode.type = 'output'
            return [];
        }
        return filteredStarships.map((starship: StarshipType, index: number) => ({ 
            id:  filmNode.id + "-" + starship.url,  
            targetPosition: Position.Left,
            type: 'output',
            position: { x: filmNode.position.x + getRandom(158, 300),  y: filmNode.position.y - arraySize * getRandom(5, 20) + index * 80 }, 
            data: { label: starship.name }, 
            style: { '--handle-color':  'black' } as CSSProperties & { [key: string]: string }
        }));
    };

    function getRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
export default { createNodeFromCharacter, createNodesFromFilms: createNodeFromFilms, createNodesFromStarships };