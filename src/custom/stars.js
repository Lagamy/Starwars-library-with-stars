import React, { useEffect, useRef, useState } from 'react';

const Stars = ({ Loading, Class, Size, paralaxSpeed }) => {
  let starsContainer = useRef(null); // Reference to the stars container
  let stars = null;  // Store star positions and colors
  let visibleStars;
  let lowestStarLocation = 0 // due to infinite scroll - I need to generate new set of stars downwards from lowest star, avoiding double "staring" area. 
  
  useEffect(() => {
    function handleResize() {
      starsContainer.current.style.boxShadow = "";
      lowestStarLocation = 0;
      generateStars(document.documentElement.scrollWidth);
    }

    function handleParalax()
    {
      let paralax = window.scrollY * paralaxSpeed
      updateVisibleStars(paralax);
    
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



  useEffect(() => {

  })

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
    let id = 1;
    const newStars = [];
    for (let i = 0; i < numberStars; i++) {
      const top = Math.random() * availableHeight;
      const left = Math.random() * pageWidth;
      const color = colorPicker();
      newStars.push({ top, left, color, id });
      id++;
    }
    stars = newStars;
    initializeVisibleStars();
  }
}



const initializeVisibleStars = () => {
    // clear any existing stars
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Filter for stars in the viewport
    visibleStars = stars.filter(
      (star) => star.top >= viewportTop && star.top <= viewportBottom
    );
    visibleStars.forEach(({ top, left, color, id }) => {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${top}px`;
      star.style.left = `${left}px`;
      star.style.width = `${Size}px`;
      star.style.height = `${Size}px`;
      star.style.backgroundColor = `${color}`;
      star.style.boxShadow = `0px 0px 50px 10px ${color}`;
      star.style.borderRadius = `0px`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${Math.random() * 5}s`;
      star.dataset.id = id;
      starsContainer.current.appendChild(star);
    });
}

const updateVisibleStars = (paralax) => {
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  console.log(paralax)
  let currentVisibleStars = stars.filter(
    (star) => star.top + paralax >= viewportTop && star.top + paralax <= viewportBottom// add paralax changes here
  );

  visibleStars.forEach(({ top, left, color, id }) => {
    if (!contains(currentVisibleStars, id))
    {
      const starElement = document.querySelector(`[data-id="${id}"]`);
      if (starElement) {
        //console.log(starElement)
        starElement.remove();
      }
    }
  });


  currentVisibleStars.forEach(({ top, left, color, id }) => {
    if (!contains(visibleStars, id))
    {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${top}px`;
      star.style.left = `${left}px`;
      star.style.width = `${Size}px`;
      star.style.height = `${Size}px`;
      star.style.backgroundColor = `${color}`;
      star.style.boxShadow = `0px 0px 50px 8px ${color}`;
      star.style.borderRadius = `0px`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${Math.random() * 5}s`;
      star.dataset.id = id; // Store top as data attribute
      starsContainer.current.appendChild(star);
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