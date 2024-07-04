function generatePokemonHtml(capitalizedPokemonName, typesHtml, pokemon, i, backgroundColor) {
    return `
    <div class="card" style="width: 18rem; background-color: ${backgroundColor};" data-index="${i}" onclick="openCard(${i})">
      <div class="pkmName mb-15">${capitalizedPokemonName}</div>
      <div class="types mb-15">${typesHtml}</div>
      <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
    </div>
  `;
}