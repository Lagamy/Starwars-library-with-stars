import React, { useEffect, useRef, useState } from 'react';

const Stars = ({ Loading, Class, Size }) => {
  let starsContainer = useRef(null); // Reference to the stars container
  const [stars, setStars] = useState([]);  // Store star positions and colors
  let lowestStarLocation = 0 // due to infinite scroll - I need to generate new set of stars downwards from lowest star, avoiding double "staring" area. 

  useEffect(() => {
    function handleResize() {
      starsContainer.current.style.boxShadow = "";
      lowestStarLocation = 0;
      generateStars(document.documentElement.scrollWidth);
    }

    function handleParalax()
    {
      const foreground = document.querySelector('.foreground-stars');
      //console.log(foreground)
      foreground.style.setProperty('--translateY', `${window.scrollY * 0.6}px`);
      //console.log("ScrollY: ", window.scrollY);
      //console.log("Foreground Transform: ", 'translate3d(0px, ' + window.scrollY * -3 + 'px, 0)');
      const middleground = document.querySelector('.middleground-stars');
      //console.log(middleground)
      middleground.style.setProperty('--translateY', `${window.scrollY * 0.3}px`);
    }
    window.addEventListener('scroll', handleParalax)
    window.addEventListener('resize', handleResize)


    // Clean up on component unmount
    return () => { 
      window.removeEventListener('scroll', handleParalax);
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // wait till card pictures are loaded
    const timeoutId = setTimeout(() => {
      generateStars(document.documentElement.scrollWidth);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [Loading]);



  // const generateStars = (pageWidth) => {
  //   if(!Loading) {
  //     // clear any existing stars
  //     if (starsContainer.current && lowestStarLocation === 0) {
  //          starsContainer.current.style.boxShadow = [];
  //     }
  //     const numberStars = 2000;
  //     const availableHeight = document.documentElement.scrollHeight - lowestStarLocation;
  //     const boxShadowArray = [];

  //     for (let i = 0; i < numberStars; i++) {
  //       const top = Math.random() * availableHeight;
  //       const left = Math.random() * pageWidth;
  //       const color = colorPicker(); // Pick a random color
  //       boxShadowArray.push(`${left}px ${top}px ${color}`);
  //       boxShadowArray.push(`${left}px ${top}px 50px 8px ${color}`)
  //       lowestStarLocation = document.documentElement.scrollHeight;
  //     }
  //     starsContainer.current.style.boxShadow = boxShadowArray.join(", ");
  //   }
  // };
  const generateStars = (pageWidth) => {
  if(!Loading) {
    // clear any existing stars
    if (starsContainer.current && lowestStarLocation === 0) {
        starsContainer.current.innerHTML = "";
    }
    const numberStars = 2000;
    const availableHeight = document.documentElement.scrollHeight - lowestStarLocation;
    for (let i = 0; i < numberStars; i++) {
      var color = colorPicker();
      const star = document.createElement("div");
      //star.classList.add(Class);
      star.classList.add("star");
      star.style.top = `${Math.random() * availableHeight}px`;
      star.style.left = `${Math.random() * pageWidth}px`;
      star.style.width = `${Size}px`;
      star.style.backgroundColor = `${color}`;
      star.style.height = `${Size}px`;
      star.style.animationDuration = `${Math.random() * 5}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.boxShadow = `0px 0px 50px 8px ${color}`
      star.style.borderRadius = `0px`
      starsContainer.current.appendChild(star);
      lowestStarLocation = Math.max(parseFloat(star.style.top), lowestStarLocation);
    }
  }
}
  return <div ref={starsContainer} className={`stars  ${Class}`}></div>;
};

const colorPicker = () => {
    const randNum = Math.floor(Math.random() * 3) + 1; // random integer between 1 and 3
    switch (randNum) {
        case 1: return 'white';
        case 2: return 'yellow';
        case 3: return 'cyan';
    }
};
export default Stars;