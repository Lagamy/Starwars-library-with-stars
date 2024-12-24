import { type } from "@testing-library/user-event/dist/type";
import { colorDecider, colorTranslator, eyeColorTranslator, filmColorDecider } from "./nodeColorPicker";

const min = 200;
const max = 350;
const groupNodeSize = { width: 800, height: 1200 }; // group node size
const padding = 50; // minimum space between nodes to avoid overlap and make it visually pleasing
const canvasWidth = 15000; // maximum width of the canvas
const canvasHeight = 15000; // maximum height of the canvas

    const glowingNodeStyle = (BorderColor, TextColor) => 
    {
        return {
            '--text-color': TextColor,
            '--border-color': BorderColor,
            '--handle-color': BorderColor
        };
    }

    export const createGroupNodes = (Characters) => 
    {
        const characterNodes = [];
        const groupNodes = [];

        Characters.forEach((character) => {
            let position;

            // find a valid position that doesn't overlap with existing nodes
            while (true) {
                position = {
                    x: Math.random() * (canvasWidth - groupNodeSize.width), // Random x within bounds
                    y: Math.random() * (canvasHeight - groupNodeSize.height), // Random y within bounds
                };

                // check if the new node overlaps with any existing nodes
                const overlaps = groupNodes.some((node) => {
                    return (
                        position.x < node.position.x + groupNodeSize.width + padding &&
                        position.x + groupNodeSize.width > node.position.x - padding &&
                        position.y < node.position.y + groupNodeSize.height + padding &&
                        position.y + groupNodeSize.height > node.position.y - padding
                    );
                });

                if (!overlaps) {
                    break; // found a position that does not overlap
                }
            }

            // add the new group to the array
            let nodeStyle = {
                width: groupNodeSize.width,
                height: groupNodeSize.height,
                display: 'none'
            }
            let groupNode = {
                id: `${character.id}`,
                type: 'group',
                position,
                data: { label: null },
                style: nodeStyle
            };
            groupNodes.push(groupNode)
            let charNode = createNodeFromCharacter(character);
            characterNodes.push(charNode)
        });

        return { characterNodes, groupNodes };  // Return 2 arrays, one of character nodes and other of group nodes
    } 


    export const createNodeFromCharacter = (character) => {
        // console.log(character);
        let BorderColor = colorDecider(character.skin_color, character.hair_color);
        BorderColor = colorTranslator(BorderColor);
        let TextColor = eyeColorTranslator(character.eye_color);

        let nodeStyle = glowingNodeStyle(BorderColor, TextColor)

        return({
            id: `${character.url}`,
            type: 'input',
            sourcePosition: 'right',
            position: {x: 10, y: 0},
            data: { id: character.url, films: character.films, starships: character.starships, strokeColor: TextColor, label: character.name, pressed: true },
            style: nodeStyle,
        });
    };


    export const createNodesFromFilms = (characterNode, film, size, index) => {
        // randomised distance between character and his films. Purely visual
        let Color = filmColorDecider(film.episode_id);
        console.log("Film: " + film.episode_id)
        console.log("Color: " + Color);
        let nodeStyle = glowingNodeStyle(Color, Color)
        
        return ({ 
            id: film.url, 
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'default',
            position: { x: characterNode.position.x + Math.floor(Math.random() * (max - min + 1)) + min, y: characterNode.position.y - size * 40 + index * 140 }, 
            data: { starships: film.starships, label: film.title, pressed: false, strokeColor: Color },
            style: nodeStyle,
        });
    };


    export const createNodesFromStarships = (filmNode, starships) => {
        
        const filteredStarships = starships.filter(starship => filmNode.data.starships.includes(starship.url));
        const arraySize = filteredStarships.length;
        if(arraySize == 0)
        {
            filmNode.style = { '--handle-color':  'black'};
            filmNode.type = 'output'
            return [];
        }
        return filteredStarships.map((starship, index) => ({ 
            id:  filmNode.id + "-" + starship.url, 
            targetPosition: 'left',
            type: 'output',
            position: { x: filmNode.position.x + getRandom(158, 300),  y: filmNode.position.y - arraySize * getRandom(5, 20) + index * 80 }, 
            data: { label: starship.name }, 
            style: { '--handle-color':  'black' }
        }));
    };

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
export default { createNodeFromCharacter, createNodesFromFilms, createNodesFromStarships };