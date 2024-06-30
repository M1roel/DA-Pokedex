let limit = 20;
let offset = 0;
const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

function init() {
  fetchDataJson();
}

async function fetchDataJson() {
  let response = await fetch(BASE_URL);
  data = await response.json();
  showPokemon(data.results);
}

async function showPokemon(pokemons) {
  document.querySelector(".content").innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    let pokemonDetails = await fetchPokemonDetails(pokemon.url);
    document.querySelector(".content").innerHTML +=
      generatePokemon(pokemonDetails);
  }
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

function generatePokemon(pokemon) {
  const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);
  let statsHtml = '';

  for (const stat of pokemon.stats) {
    const statName = capitalizeFirstLetter(stat.stat.name.replace('-', ' '));
    const statValue = stat.base_stat;
    statsHtml += `
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: ${statValue}%" aria-valuenow="${statValue}" aria-valuemin="0" aria-valuemax="100">${statName}: ${statValue}</div>
      </div>
    `;
  }

  return `
    <div class="card" style="width: 18rem;">
      <div class="pkmName">${capitalizedPokemonName}</div>
      <img class="card-img-top" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
      <div class="card-body">
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        ${statsHtml}
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