function init() {
  fetchDataJson();
}

function getBaseUrl() {
  return BASE_URL_TEMPLATE.replace("{limit}", limit).replace("{offset}", offset);
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

async function showPokemon(pokemons) {
  for (let pokemon of pokemons) {
    let pokemonDetails = await fetchPokemonDetails(pokemon.url);
    let speciesDetails = await fetchSpeciesDetails(pokemonDetails.species.url);
    pokemonDetails.speciesDetails = speciesDetails;
    storedPokemons.push(pokemonDetails);
    contentDiv.innerHTML += generatePokemon(pokemonDetails, storedPokemons.length - 1);
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
  const typesHtml = generateTypesHtml(pokemon.types);
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";

  return generatePokemonHtml(capitalizedPokemonName, typesHtml, pokemon, i, backgroundColor);
}

function loadMore() {
  offset += 20;
  fetchDataJson();
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function openCard(i) {
  currentIndex = i;
  const pokemon = storedPokemons[currentIndex];
  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  const statsHtml = generateStatsHtml(pokemon.stats);
  const typesHtml = generateTypesHtml(pokemon.types);
  const flavorText = getFlavorText(pokemon.speciesDetails, "de");
  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFF";
  const openCardContent = generateOpenCardContent(capitalizedPokemonName, typesHtml, flavorText, statsHtml, pokemon, backgroundColor);
  updateOpenCard(openCardContent);
  toggleOpenCardDisplay(true);
  updateArrowsVisibility(currentIndex, storedPokemons.length);
}

function updateOpenCard(content) {
  const openCardDiv = document.querySelector('.open-card');
  openCardDiv.innerHTML = content;

  const arrowLeft = document.querySelector('.arrow-left');
  const arrowRight = document.querySelector('.arrow-right');

  arrowLeft.addEventListener('click', function(event) {
    event.stopPropagation();
    navigateCard(-1);
  });

  arrowRight.addEventListener('click', function(event) {
    event.stopPropagation();
    navigateCard(1);
  });
}

function closeCard() {
  toggleOpenCardDisplay(false);
  openCardDiv.innerHTML = "";
}

function navigateCard(direction) {
  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = storedPokemons.length - 1;
  } else if (currentIndex >= storedPokemons.length) {
    currentIndex = 0;
  }

  openCard(currentIndex);
  updateArrowsVisibility(currentIndex, storedPokemons.length);
}

function showLoadingScreen() {
  toggleElement(pokeballIcon, "pokeball-icon", true);
  toggleElement(contentDiv, "d-none", true);
  toggleElement(loadMoreBtn, "d-none", true);
  toggleElement(loadingScreen, "d-none", false);
}

function stopLoadingScreen() {
  toggleElement(pokeballIcon, "pokeball-icon", false);
  toggleElement(contentDiv, "d-none", false);
  toggleElement(loadMoreBtn, "d-none", false);
  toggleElement(loadingScreen, "d-none", true);
}

searchInputElem.addEventListener("input", function() {
  filterAndShow(searchInputElem);
});