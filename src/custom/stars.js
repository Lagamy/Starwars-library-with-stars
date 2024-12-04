import React, { useEffect, useRef, useState } from 'react';

const Stars = ({ Loading, Class, Amount, Size, paralaxSpeed }) => {
  let starsContainer = useRef(null); // Reference to the stars container
  let stars = new Set();  // Store star positions and colors
  let visibleStars = new Set();
  let lowestStarLocation = 0 // due to infinite scroll - I need to generate new set of stars downwards from lowest star, avoiding double "staring" area. 
  let debounceTimeout;
  let screenBuffer = 0;

  useEffect(() => {
    function handleResize() {
      starsContainer.current.style.boxShadow = "";
      lowestStarLocation = 0;
      generateStars(document.documentElement.scrollWidth);
    }

    function handleParalax()
    {
      let paralax = window.scrollY * paralaxSpeed
          // Debounce the updateVisibleStars call
      //clearTimeout(debounceTimeout);
      //debounceTimeout = setTimeout(() => {
          updateVisibleStars(paralax);
      //}, 100); // Adjust debounce delay as needed (100ms here)
    
      starsContainer.current.style.setProperty('--translateY', `${paralax}px`);
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
    const availableHeight = document.documentElement.scrollHeight - lowestStarLocation;
    let id = 1;
    for (let i = 0; i < Amount; i++) {
      const top = Math.random() * availableHeight;
      const left = Math.random() * pageWidth;
      const color = colorPicker();
      stars.add({ top, left, color, id });
      id++;
    }
    initializeVisibleStars();
  }
}



const initializeVisibleStars = () => {
    // clear any existing stars
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Filter for stars in the viewport
    stars.forEach(star => {
      if (star.top >= viewportTop - screenBuffer && star.top <= viewportBottom + screenBuffer) {
        visibleStars.add(star);
      }
    });

    visibleStars.forEach((star) => {
      const Star = document.createElement('div');
      Star.classList.add('star');
      Star.style.top = `${star.top}px`;
      Star.style.left = `${star.left}px`;
      Star.style.width = `${Size}px`;
      Star.style.height = `${Size}px`;
      Star.style.backgroundColor = `${star.color}`;
      Star.style.boxShadow = `0px 0px 70px 12px ${star.color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.id;
      starsContainer.current.appendChild(Star);
    });
}

const updateVisibleStars = (paralax) => {
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  console.log(paralax)
  let currentVisibleStars = new Set();
  stars.forEach(star => {
    if (star.top + paralax >= viewportTop - screenBuffer && star.top + paralax <= viewportBottom + screenBuffer) {
        currentVisibleStars.add(star);
    }
  });

  visibleStars.forEach((star) => {
    if (!currentVisibleStars.has(star))
    {
      const starElement = document.querySelector(`[data-id="${star.id}"]`);
      if (starElement) {
        //console.log(starElement)
        starElement.remove();
      }
    }
  });


  currentVisibleStars.forEach((star) => {
    if (!visibleStars.has(star))
    {
      const Star = document.createElement('div');
      Star.classList.add('star');
      Star.style.top = `${star.top}px`;
      Star.style.left = `${star.left}px`;
      Star.style.width = `${Size}px`;
      Star.style.height = `${Size}px`;
      Star.style.backgroundColor = `${star.color}`;
      Star.style.boxShadow = `0px 0px 70px 12px ${star.color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.id; // Store id as data attribute
      starsContainer.current.appendChild(Star);
    }
  });
  visibleStars = currentVisibleStars;
}

  return <div ref={starsContainer} className={`stars  ${Class}`}></div>;
};


const contains = (array, id) => {
  return array.some((star) => star.id === id)
}


const colorPicker = () => {
    const randNum = Math.floor(Math.random() * 3) + 1; // random integer between 1 and 3
    switch (randNum) {
        case 1: return 'white';
        case 2: return 'yellow';
        case 3: return 'cyan';
    }
};
export default Stars;