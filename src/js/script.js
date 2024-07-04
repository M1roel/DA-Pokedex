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
  const searchInput = getSearchInput();
  const contentDiv = document.querySelector(".content");
  contentDiv.innerHTML = "";

  if (searchInput.length >= 3) {
    const filteredPokemons = filterPokemonsByName(searchInput);
    displayPokemons(filteredPokemons, contentDiv);
  } else {
    displayPokemons(storedPokemons, contentDiv);
  }
}

async function showPokemon(pokemons) {
  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let pokemonDetails = await fetchPokemonDetails(pokemon.url);
    let speciesDetails = await fetchSpeciesDetails(pokemonDetails.species.url);
    pokemonDetails.speciesDetails = speciesDetails;
    storedPokemons.push(pokemonDetails);
    document.querySelector(".content").innerHTML += generatePokemon(
      pokemonDetails,
      storedPokemons.length - 1
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

function generatePokemon(pokemon, i) {
  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  const typesHtml = generateTypesHtml(pokemon.types);
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";

  return generatePokemonHtml(capitalizedPokemonName, typesHtml, pokemon, i, backgroundColor);
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
  const openCardDiv = document.getElementById("open-card");
  const overflow = document.querySelector("body");
  const arrows = document.querySelector(".arrows");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");

  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  const statsHtml = generateStatsHtml(pokemon.stats);
  const typesHtml = generateTypesHtml(pokemon.types);
  const flavorText = getFlavorText(pokemon.speciesDetails, "de");

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";

  const openCardContent = generateOpenCardContent(capitalizedPokemonName, typesHtml, flavorText, statsHtml, pokemon, backgroundColor);

  openCardDiv.innerHTML = openCardContent;
  openCardDiv.classList.remove("d-none");
  arrows.classList.remove("d-none");
  overflow.classList.add("no-scroll");

  updateArrowsVisibility(currentIndex, arrowLeft, arrowRight, storedPokemons.length);
}


function closeCard() {
  const openCardDiv = document.getElementById("open-card");
  const overflow = document.querySelector("body");
  const arrows = document.querySelector(".arrows");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");
  openCardDiv.classList.add("d-none");
  arrows.classList.add("d-none");
  overflow.classList.remove("no-scroll");
  arrowLeft.classList.remove("d-none");
  arrowRight.classList.remove("d-none");
  openCardDiv.innerHTML = "";
}

function navigateCard(direction) {
  currentIndex += direction;
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");
  if (currentIndex < 0) {
    currentIndex = storedPokemons.length - 1;
  } else if (currentIndex >= storedPokemons.length) {
    currentIndex = 0;
  }
  openCard(currentIndex);

  if (currentIndex === 0) {
    arrowLeft.classList.add("d-none");
  } else {
    arrowLeft.classList.remove("d-none");
  }

  if (currentIndex == storedPokemons.length - 1) {
    arrowRight.classList.add("d-none");
  } else {
    arrowRight.classList.remove("d-none");
  }
}

function showLoadingScreen() {
  document.getElementById("pokeballIcon").classList.add("pokeball-icon");
  document.querySelector(".content").classList.add("d-none");
  document.querySelector(".load-more-btn").classList.add("d-none");
  document.querySelector(".loadingScreen").classList.remove("d-none");
}

function stopLoadingScreen() {
  document.getElementById("pokeballIcon").classList.remove("pokeball-icon");
  document.querySelector(".content").classList.remove("d-none");
  document.querySelector(".load-more-btn").classList.remove("d-none");
  document.querySelector(".loadingScreen").classList.add("d-none");
}

document.getElementById("searchInput").addEventListener("input", filterAndShow);
