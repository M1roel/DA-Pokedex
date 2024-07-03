let limit = 20;
let offset = 0;
const BASE_URL_TEMPLATE = `https://pokeapi.co/api/v2/pokemon?limit={limit}&offset={offset}`;

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
  dark: "#705848"
};

let storedPokemons = [];

function init() {
  fetchDataJson();
}

function getBaseUrl() {
  return BASE_URL_TEMPLATE.replace('{limit}', limit).replace('{offset}', offset);
}

async function fetchDataJson() {
  try {
    let response = await fetch(getBaseUrl());
    let data = await response.json();
    showPokemon(data.results);
  } catch (error) {
    console.error("Fehler beim Abrufen der Pokemon-Daten:", error);
  }
}

async function showPokemon(pokemons) {
  document.querySelector(".content").innerHTML = "";
  storedPokemons = [];

  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let pokemonDetails = await fetchPokemonDetails(pokemon.url);
    let speciesDetails = await fetchSpeciesDetails(pokemonDetails.species.url);
    let flavorText = getFlavorText(speciesDetails, "de");
    pokemonDetails.speciesDetails = speciesDetails; // Speichern Sie die Speziesdetails im Pokémon-Objekt
    storedPokemons.push(pokemonDetails);
    document.querySelector(".content").innerHTML += generatePokemon(
      pokemonDetails,
      flavorText,
      i // Übergeben Sie den Index
    );
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
  return flavorTextEntry
    ? flavorTextEntry.flavor_text
    : "Keine Beschreibung verfügbar";
}

function generatePokemon(pokemon, flavorText, index) {
  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  let statsHtml = "";
  let typesHtml = "";

  for (const stat of pokemon.stats) {
    const statName = capitalizeFirstLetter(stat.stat.name.replace("-", " "));
    const statValue = stat.base_stat;
    statsHtml += `
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${statValue}%" aria-valuenow="${statValue}" aria-valuemin="0" aria-valuemax="100">${statName}: ${statValue}</div>
      </div>
    `;
  }

  for (const type of pokemon.types) {
    const typeUrl = type.type.url;
    const typeId = typeUrl.split('/').filter(Boolean).pop();
    typesHtml += `<img src="./img/${typeId}.png" alt="${type.type.name}" class="type-icon">`;
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || '#FFF';

  return `
    <div class="card" style="width: 18rem; background-color: ${backgroundColor};" data-index="${index}" onclick="openCard(${index})">
      <div class="pkmName mb-15">${capitalizedPokemonName}</div>
      <div class="types mb-15">${typesHtml}</div>
      <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
      <div class="card-body">
        <!-- <p class="card-text mb-15">${flavorText}</p> -->
        <!-- ${statsHtml} -->
      </div>
    </div>
  `;
}

function loadMore() {
  limit += 20;
  init();
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function openCard(index) {
  const pokemon = storedPokemons[index];

  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  let statsHtml = "";
  let typesHtml = "";
  let flavorText = getFlavorText(pokemon.speciesDetails, "de");

  for (const stat of pokemon.stats) {
    const statName = capitalizeFirstLetter(stat.stat.name.replace("-", " "));
    const statValue = stat.base_stat;
    statsHtml += `
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${statValue}%" aria-valuenow="${statValue}" aria-valuemin="0" aria-valuemax="100">${statName}: ${statValue}</div>
      </div>
    `;
  }

  for (const type of pokemon.types) {
    const typeUrl = type.type.url;
    const typeId = typeUrl.split('/').filter(Boolean).pop();
    typesHtml += `<img src="./img/${typeId}.png" alt="${type.type.name}" class="type-icon">`;
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || '#FFF';

  const openCardContent = `
    <button onclick="closeCard()" class="btn-close">Close</button>
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

  const openCardDiv = document.getElementById("open-card");
  if (openCardDiv) {
    openCardDiv.innerHTML = openCardContent;
    openCardDiv.classList.remove("d-none");
  } else {
    console.error("Das Element '#open-card' wurde nicht gefunden.");
  }
}

function closeCard() {
  const openCardDiv = document.querySelector(".open-card");
  if (openCardDiv) {
    openCardDiv.classList.add("d-none");
    openCardDiv.innerHTML = "";
  } else {
    console.error("Das Element '#open-card' wurde nicht gefunden.");
  }
}
