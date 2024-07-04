let limit = 40;
let offset = 0;
const BASE_URL_TEMPLATE = `https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}`;
const MAX_DISPLAY_POKEMONS = 10;

const typeColors = {
  grass: "#78C850",
  poison: "#A040A0",
  fire: "#F08030",
  flying: "#A890F0",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  ice: "#98D8D8",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
};

let storedPokemons = [];
let currentIndex = 0;

function init() {
  fetchDataJson();
}

function getBaseUrl() {
  return BASE_URL_TEMPLATE.replace("{limit}", limit).replace(
    "{offset}",
    offset
  );
}

async function fetchDataJson() {
  try {
    let response = await fetch(getBaseUrl());
    let data = await response.json();

    showLoadingScreen();
    
    await showPokemon(data.results);
    
    stopLoadingScreen();

  } catch (error) {
    console.error("Fehler beim Abrufen der Pokemon-Daten:", error);
  }
}

function filterAndShow() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
  if (searchInput.length >= 3) {
    const filteredPokemons = storedPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchInput)
    );
    document.querySelector(".content").innerHTML = "";
    filteredPokemons.slice(0, MAX_DISPLAY_POKEMONS).forEach((pokemon, index) => {
      document.querySelector(".content").innerHTML += generatePokemon(pokemon, index);
    });
  } else {
    document.querySelector(".content").innerHTML = "";
    storedPokemons.forEach((pokemon, index) => {
      document.querySelector(".content").innerHTML += generatePokemon(pokemon, index);
    });
  }
}

async function showPokemon(pokemons) {
  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let pokemonDetails = await fetchPokemonDetails(pokemon.url);
    let speciesDetails = await fetchSpeciesDetails(pokemonDetails.species.url);
    pokemonDetails.speciesDetails = speciesDetails;
    storedPokemons.push(pokemonDetails);
    document.querySelector(".content").innerHTML += generatePokemon(pokemonDetails, storedPokemons.length - 1);
  }
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

async function fetchSpeciesDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

function getFlavorText(species, language) {
  let flavorTextEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === language
  );
  return flavorTextEntry ? flavorTextEntry.flavor_text : "Keine Beschreibung verfügbar";
}

function generatePokemon(pokemon, i) {
  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  let typesHtml = "";

  for (const type of pokemon.types) {
    const typeUrl = type.type.url;
    const typeId = typeUrl.split("/").filter(Boolean).pop();
    typesHtml += `<img src="./img/${typeId}.png" alt="${type.type.name}" class="type-icon">`;
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";

  return `
    <div class="card" style="width: 18rem; background-color: ${backgroundColor};" data-index="${i}" onclick="openCard(${i})">
      <div class="pkmName mb-15">${capitalizedPokemonName}</div>
      <div class="types mb-15">${typesHtml}</div>
      <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
    </div>
  `;
}

function loadMore() {
  offset += 40;
  fetchDataJson();
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function openCard(i) {
  currentIndex = i;
  const pokemon = storedPokemons[currentIndex];
  const openCardDiv = document.getElementById('open-card');
  const overflow = document.querySelector('body');
  const arrows = document.querySelector('.arrows');
  const arrowLeft = document.querySelector('.arrow-left');
  const arrowRight = document.querySelector('.arrow-right');

  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  let statsHtml = "";
  let typesHtml = "";
  let flavorText = getFlavorText(pokemon.speciesDetails, "de");

  for (const stat of pokemon.stats) {
    const statName = capitalizeFirstLetter(stat.stat.name.replace("-", " "));
    const statValue = stat.base_stat;
    statsHtml += `
      <div class="stat-container">
        <div class="stat-name">${statName}</div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: ${statValue}%" aria-valuenow="${statValue}" aria-valuemin="0" aria-valuemax="100">${statValue}</div>
        </div>
      </div>
    `;
  }

  for (const type of pokemon.types) {
    const typeUrl = type.type.url;
    const typeId = typeUrl.split("/").filter(Boolean).pop();
    typesHtml += `<img src="./img/${typeId}.png" alt="${type.type.name}" class="type-icon">`;
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";

  const openCardContent = `
    <div class="card" style="width: 18rem; background-color: ${backgroundColor};">
      <div class="pkmName mb-15">${capitalizedPokemonName}</div>
      <div class="types mb-15">${typesHtml}</div>
      <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
      <div class="card-body">
        <p class="card-text mb-15">${flavorText}</p>
        ${statsHtml}
      </div>
    </div>
  `;

  openCardDiv.innerHTML = openCardContent;
  openCardDiv.classList.remove('d-none');
  arrows.classList.remove('d-none');
  overflow.classList.add('no-scroll');

  if (currentIndex === 0) {
    arrowLeft.classList.add('d-none');
  } else {
    arrowLeft.classList.remove('d-none');
  }

  if (currentIndex === storedPokemons.length - 1) {
    arrowRight.classList.add('d-none');
  } else {
    arrowRight.classList.remove('d-none');
  }
}

function closeCard() {
  const openCardDiv = document.getElementById('open-card');
  const overflow = document.querySelector('body');
  const arrows = document.querySelector('.arrows');
  const arrowLeft = document.querySelector('.arrow-left');  
  const arrowRight = document.querySelector('.arrow-right');
  openCardDiv.classList.add('d-none');
  arrows.classList.add('d-none');
  overflow.classList.remove('no-scroll')
  arrowLeft.classList.remove('d-none');
  arrowRight.classList.remove('d-none');
  openCardDiv.innerHTML = '';
}

function navigateCard(direction) {
  currentIndex += direction;
  const arrowLeft = document.querySelector('.arrow-left');
  const arrowRight = document.querySelector('.arrow-right');
  if (currentIndex < 0) {
    currentIndex = storedPokemons.length - 1;
  } else if (currentIndex >= storedPokemons.length) {
    currentIndex = 0;
  }
  openCard(currentIndex);

  if (currentIndex === 0) {
    arrowLeft.classList.add('d-none');
  } else {
    arrowLeft.classList.remove('d-none');
  }

  if (currentIndex == storedPokemons.length-1) {
    arrowRight.classList.add('d-none');
  } else {
    arrowRight.classList.remove('d-none');
  }
}

function showLoadingScreen() {
  document.getElementById('pokeballIcon').classList.add('pokeball-icon');
  document.querySelector('.content').classList.add('d-none');
  document.querySelector('.load-more-btn').classList.add('d-none');
  document.querySelector('.loadingScreen').classList.remove('d-none');
}

function stopLoadingScreen() {
  document.getElementById('pokeballIcon').classList.remove('pokeball-icon');
  document.querySelector('.content').classList.remove('d-none');
  document.querySelector('.load-more-btn').classList.remove('d-none');
  document.querySelector('.loadingScreen').classList.add('d-none');
}

document.getElementById('searchInput').addEventListener('input', filterAndShow);
