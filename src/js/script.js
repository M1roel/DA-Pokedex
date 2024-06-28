const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10";

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
  return `
      <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="card-body">
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div>
      `;
}
