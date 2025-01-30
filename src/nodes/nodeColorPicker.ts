const commonSkinColors = ['fair', 'tan', 'pale'] // if skin color is not unique character trait(Like with Yoda and Darth Maul) - than use hair color for node border  

const colorDecider = (skinColor: string, hairColor: string) =>
{
    // if skin color is unique or hair color is unknown - use skin color for borders
    if((!commonSkinColors.includes(skinColor) && skinColor != 'unknown') || (hairColor == "n/a" || hairColor == "none" ))
    {
        return skinColor
    }
    else
    {
        return hairColor
    }
}

const colorTranslator = (color: string) => 
{
    let Color = color.split(",")[0];
    switch(Color)
    {
        case 'blond':
            return '#F1CC8F';
        case 'fair': // array set for multiple cases
        case 'pale' :
        case 'light': 
            return '#EDDDD1';
        case 'tan':
            return '#D2B48C';
        case 'auburn':
             return 'orange';
        case 'hazel':
            return '#BAB86C';
        case 'dark':
            return '#5c4033';
        case 'black':
            return '#3D3635';
        case 'white':
            return 'silver';
        default: 
            return color
    }
}


const eyeColorTranslator = (color: string) => 
{
    switch(color)
    {
        case 'blue': 
            return '#50ABE4';
        case 'black': 
            return '#3D3635';
        case 'white':
            return 'silver';
        default: 
            return color
    }
}

const filmColorDecider = (episode_id: number) =>
{
    switch(episode_id)
    {
        case 1: 
            return '#ffff00';
        case 2: 
            return '#9b00d9';
        case 3:
            return '#ff6600';
        case 4: 
            return '#00d0ff';
        case 5: 
            return '#ff3333';
        case 6: 
            return '#00ff00';
        default: 
            return '#fffff';
    }
}
export{colorDecider, colorTranslator, eyeColorTranslator, filmColorDecider}