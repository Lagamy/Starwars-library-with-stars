import React, { useEffect, useRef } from 'react';
import { Star } from '../types';

export default function Stars (
  { Class, Weight, Size, paralaxSpeed, Id, IgnoreScroll, ReactFlow } : {
    Class: string,
    Weight: number, 
    Size: number, 
    paralaxSpeed: number,
    Id: string, 
    IgnoreScroll: boolean, 
    ReactFlow: boolean
}){
  let starsContainer = useRef<HTMLDivElement | null>(null); // Reference to the stars container
  let stars: Set<Star> = new Set();  // Store star positions and colors
  let visibleStars: Set<Star> = new Set();
  let screenBuffer: number = 50;

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
      if(starsContainer.current) starsContainer.current.style.setProperty('--translateY', `${paralax}px`);
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
    }, 10);

    return () => clearTimeout(timeoutId);
  }, []);

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

function generateStars(pageWidth: number) {
    let ScreenRatio = window.innerHeight / window.innerWidth;
    let Amount;
    Amount = ReactFlow || ScreenRatio < 0.6 ? Weight * (document.documentElement.scrollHeight / document.documentElement.scrollWidth) :  Weight * 10; // preventing stars overflow if window is too horizontal
    //console.log("Ratio: " + document.documentElement.scrollHeight / document.documentElement.scrollWidth)
    console.log("Ratio: " + ScreenRatio); 
    //console.log(window.innerHeight);
    // clear any existing stars
    stars = new Set();
    visibleStars = new Set();
    if(starsContainer.current != null) starsContainer.current.innerHTML = "";
    const availableHeight = IgnoreScroll ? window.innerHeight : document.documentElement.scrollHeight;
    let id;
    for (let i = 0; i < Amount; i++) {
      const top = Math.random() * availableHeight;
      const left = Math.random() * pageWidth;
      const color = colorPicker();
      id = Id + '.' + i
      stars.add({ Top: top, Left: left, Color: color, Id: id });
    }
    initializeVisibleStars();
}



function initializeVisibleStars() {
    // clear any existing stars
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Filter for stars in the viewport
    stars.forEach(star => {
      if (star.Top >= viewportTop - screenBuffer && star.Top <= viewportBottom + screenBuffer) {
        visibleStars.add(star);
      }
    });
    var scaledSize = Size * (window.innerHeight / 1000);
    console.log("Amount of stars on screen: " + visibleStars.size)
    visibleStars.forEach((star) => {
      const Star = document.createElement('div');
      Star.classList.add('star');
      Star.style.top = `${star.Top}px`;
      Star.style.left = `${star.Left}px`;
      Star.style.width = `${scaledSize}px`;
      Star.style.height = `${scaledSize}px`;
      Star.style.backgroundColor = `${star.Color}`;
      Star.style.boxShadow = `0px 0px 90px 19px ${star.Color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.Id;
      if(starsContainer.current) starsContainer.current.appendChild(Star);
    });
}

function updateVisibleStars(paralax: number) {
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + window.innerHeight;
  //console.log(paralax)
  let currentVisibleStars: Set<Star> = new Set();

  stars.forEach(star => {
    if (star.Top + paralax >= viewportTop - screenBuffer && star.Top - paralax <= viewportBottom + screenBuffer) {
        currentVisibleStars.add(star);
    }
  });

  visibleStars.forEach((star) => {
    if (!currentVisibleStars.has(star))
    {
      const starElement = document.querySelector(`[data-id="${star.Id}"]`);
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
      Star.style.top = `${star.Top}px`;
      Star.style.left = `${star.Left}px`;
      Star.style.width = `${scaledSize}px`;
      Star.style.height = `${scaledSize}px`;
      Star.style.backgroundColor = `${star.Color}`;
      Star.style.boxShadow = `0px 0px 90px 19px ${star.Color}`;
      Star.style.borderRadius = `0px`;
      Star.style.animationDelay = `${Math.random() * 5}s`;
      Star.style.animationDuration = `${Math.random() * 5}s`;
      Star.dataset.id = star.Id; // Store id as data attribute

      if(starsContainer.current) starsContainer.current.appendChild(Star);
    }
  });
  visibleStars = currentVisibleStars;
}

function contains(array: Star[], id: string) {
  return array.some((star) => star.Id === id)
}


function colorPicker() {
    const randNum = Math.floor(Math.random() * 3) + 1; // random integer between 1 and 3
    switch (randNum) {
        case 1: return 'yellow';
        case 2: return 'cyan';
        default: return 'white';
    }
};

  return <div ref={starsContainer} className={`stars  ${Class}`}></div>;
};