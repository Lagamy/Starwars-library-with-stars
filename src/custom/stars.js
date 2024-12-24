import React, { useEffect, useRef } from 'react';

const Stars = ({ Loading, Class, Weight, Size, paralaxSpeed, SetId, IgnoreScroll, ReactFlow }) => {
  let starsContainer = useRef(null); // Reference to the stars container
  let stars = new Set();  // Store star positions and colors
  let visibleStars = new Set();
  let screenBuffer = 50;

  useEffect(() => {

    const handleResize = () => {
      //lowestStarLocation = 0;
      generateStars(document.documentElement.scrollWidth);
    }

    const handleParalax = () =>
    {
      let paralax = window.scrollY * paralaxSpeed
          // Debounce the updateVisibleStars call
      //clearTimeout(debounceTimeout);
      //debounceTimeout = setTimeout(() => {
      if(!IgnoreScroll) updateVisibleStars(paralax);
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

function generateStars(pageWidth) {
  if(!Loading) {
    let ScreenRatio = window.innerHeight / window.innerWidth;
    let Amount;
    Amount = ReactFlow || ScreenRatio < 0.6 ? Weight * (document.documentElement.scrollHeight / document.documentElement.scrollWidth) :  Weight * 10; // preventing stars overflow if window is too horizontal
    //console.log("Ratio: " + document.documentElement.scrollHeight / document.documentElement.scrollWidth)
    console.log("Ratio: " + ScreenRatio); 
    //console.log(window.innerHeight);
    // clear any existing stars
    stars = new Set();
    visibleStars = new Set();
    starsContainer.current.innerHTML = "";
    const availableHeight = IgnoreScroll ? window.innerHeight : document.documentElement.scrollHeight;
    let id;
    for (let i = 0; i < Amount; i++) {
      const top = Math.random() * availableHeight;
      const left = Math.random() * pageWidth;
      const color = colorPicker();
      id = SetId + '.' + i
      stars.add({ top, left, color, id });
    }
    initializeVisibleStars();
  }
}



function initializeVisibleStars() {
    // clear any existing stars
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Filter for stars in the viewport
    stars.forEach(star => {
      if (star.top >= viewportTop - screenBuffer && star.top <= viewportBottom + screenBuffer) {
        visibleStars.add(star);
      }
    });
    var scaledSize = Size * (window.innerHeight / 1000);
    console.log("Amount of stars on screen: " + visibleStars.size)
    visibleStars.forEach((star) => {
      const Star = document.createElement('div');
      Star.classList.add('star');
      Star.style.top = `${star.top}px`;
      Star.style.left = `${star.left}px`;
      Star.style.width = `${scaledSize}px`;
      Star.style.height = `${scaledSize}px`;
      Star.style.backgroundColor = `${star.color}`;
      Star.style.boxShadow = `0px 0px 90px 19px ${star.color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.id;
      starsContainer.current.appendChild(Star);
    });
}

function updateVisibleStars(paralax) {
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  //console.log(paralax)
  let currentVisibleStars = new Set();

  stars.forEach(star => {
    if (star.top + paralax >= viewportTop - screenBuffer && star.top - paralax <= viewportBottom + screenBuffer) {
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
        //starElement.style.backgroundColor = 'red'
      }
    }
  });

  var scaledSize = Size * (window.innerHeight / 1000);
  currentVisibleStars.forEach((star) => {
    if (!visibleStars.has(star))
    {
      const Star = document.createElement('div');
      Star.classList.add('star');
      Star.style.top = `${star.top}px`;
      Star.style.left = `${star.left}px`;
      Star.style.width = `${scaledSize}px`;
      Star.style.height = `${scaledSize}px`;
      Star.style.backgroundColor = `${star.color}`;
      Star.style.boxShadow = `0px 0px 90px 19px ${star.color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.id; // Store id as data attribute
      starsContainer.current.appendChild(Star);
    }
  });
  visibleStars = currentVisibleStars;
}

function contains(array, id) {
  return array.some((star) => star.id === id)
}


function colorPicker() {
    const randNum = Math.floor(Math.random() * 3) + 1; // random integer between 1 and 3
    switch (randNum) {
        case 1: return 'white';
        case 2: return 'yellow';
        case 3: return 'cyan';
    }
};

  return <div ref={starsContainer} className={`stars  ${Class}`}></div>;
};

export default Stars;