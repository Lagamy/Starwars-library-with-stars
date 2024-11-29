import { type } from "@testing-library/user-event/dist/type";
import { colorDecider, colorTranslator, eyeColorTranslator } from "./nodeColorPicker";

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
        let BorderColor = colorDecider(character.skin_color, character.hair_color);
        BorderColor = colorTranslator(BorderColor);
        let TextColor = eyeColorTranslator(character.eye_color);

        let nodeStyle = glowingNodeStyle(BorderColor, TextColor)

        return({
            id: `character-${character.id}`,
            type: 'input',
            sourcePosition: 'right',
            position: {x: 10, y: groupNodeSize.height / 3},
            data: { id: character.id, films: character.films, starships: character.starships, strokeColor: TextColor, label: character.name, pressed: false },
            style: nodeStyle,
            parentId: `${character.id}`,
            className: 'clickable-node',
            extent: 'parent',
        });
    };


    export const createNodesFromFilms = (characterNode, films) => {
        // randomised distance between character and his films. Purely visual

        const filteredFilms = films.filter(film => characterNode.data.films.includes(film.id));
        const arraySize = filteredFilms.length;
        return filteredFilms.map((film, index) => ({ 
            id: `film-${film.id}${characterNode.id}`, 
            sourcePosition: 'right',
            targetPosition: 'left',
            position: { x: characterNode.position.x + Math.floor(Math.random() * (max - min + 1)) + min, y: characterNode.position.y - arraySize * 40 + index * 140 }, 
            data: { starships: film.starships, label: film.title, pressed: false }, 
            parentId: `${characterNode.data.id}`,
            extent: 'parent',

        }));
    };


    export const createNodesFromStarships = (characterNode, filmNode, starships) => {
        const filteredStarships = starships.filter(starship => characterNode.data.starships.includes(starship.id) && filmNode.data.starships.includes(starship.id))
        const arraySize = filteredStarships.length;
        if(arraySize == 0)
        {
            filmNode.type = 'output'
            return [];
        }
        return filteredStarships.map((starship, index) => ({ 
            id: `starship-${starship.id}${filmNode.id}`, 
            targetPosition: 'left',
            type: 'output',
            position: { x: filmNode.position.x + 300,  y: filmNode.position.y - arraySize * 20 + index * 80 }, 
            data: { label: starship.name }, 
            parentId: `${characterNode.data.id}`,
            extent: 'parent',
        }));
    };

export default { createGroupNodes, createNodesFromFilms, createNodesFromStarships };