const commonSkinColors = ['fair', 'tan', 'pale'] // if skin color is not unique character trait(Like with Yoda and Darth Maul) - than use hair color for node border  

const colorDecider = (skinColor, hairColor) =>
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

const colorTranslator = (color) => 
{
    let Color = color.split(",")[0];
    switch(Color)
    {
        case 'blond':
            return '#F1CC8F';
        case 'fair', 'pale', 'light': 
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


const eyeColorTranslator = (color) => 
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

export{colorDecider, colorTranslator, eyeColorTranslator}