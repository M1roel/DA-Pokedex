function toggleOpenCardDisplay(openCardDiv, isVisible) {
  const overflow = document.querySelector("body");
  const arrows = document.querySelector(".arrows");

  if (isVisible) {
    openCardDiv.classList.remove("d-none");
    arrows.classList.remove("d-none");
    overflow.classList.add("no-scroll");
  } else {
    openCardDiv.classList.add("d-none");
    arrows.classList.add("d-none");
    overflow.classList.remove("no-scroll");
  }
}

function updateArrowsVisibility(currentIndex, totalPokemons) {
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");

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

function toggleElement(element, className, add) {
  if (add) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

function toggleOpenCardDisplay(isVisible) {
  toggleElement(openCardDiv, "d-none", !isVisible);
  toggleElement(arrows, "d-none", !isVisible);
  toggleElement(body, "no-scroll", isVisible);
}

function filterAndShow(searchInputElem) {
  const searchInput = searchInputElem.value.toLowerCase().trim();
  contentDiv.innerHTML = "";

  if (searchInput.length >= 3) {
    const filteredPokemons = filterPokemonsByName(searchInput);
    displayPokemons(filteredPokemons, contentDiv);
  } else {
    displayPokemons(storedPokemons, contentDiv);
  }
}
