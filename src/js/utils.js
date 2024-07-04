function updateArrowsVisibility(
  currentIndex,
  arrowLeft,
  arrowRight,
  totalPokemons
) {
  if (currentIndex === 0) {
    arrowLeft.classList.add("d-none");
  } else {
    arrowLeft.classList.remove("d-none");
  }

  if (currentIndex === totalPokemons - 1) {
    arrowRight.classList.add("d-none");
  } else {
    arrowRight.classList.remove("d-none");
  }
}

function getSearchInput() {
  return document.getElementById("searchInput").value.toLowerCase().trim();
}

function filterPokemonsByName(searchInput) {
  return storedPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchInput)
  );
}

function displayPokemons(pokemons, contentDiv) {
  pokemons.slice(0, MAX_DISPLAY_POKEMONS).forEach((pokemon, index) => {
    const originalIndex = storedPokemons.indexOf(pokemon);
    contentDiv.innerHTML += generatePokemon(pokemon, originalIndex);
  });
}
