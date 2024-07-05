function generatePokemonHtml(capitalizedPokemonName, typesHtml, pokemon, i, backgroundColor) {
  return `
    <div class="card" style="width: 18rem; background-color: ${backgroundColor};" data-index="${i}" onclick="openCard(${i})">
      <div class="pkmName mb-15">${capitalizedPokemonName}</div>
      <div class="types mb-15">${typesHtml}</div>
      <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
    </div>
  `;
}

function generateTypesHtml(types) {
  let typesHtml = "";
  for (const type of types) {
    const typeUrl = type.type.url;
    const typeId = typeUrl.split("/").filter(Boolean).pop();
    typesHtml += `<img src="./img/${typeId}.png" alt="${type.type.name}" class="type-icon">`;
  }
  return typesHtml;
}

function generateStatsHtml(stats) {
  let statsHtml = "";
  for (const stat of stats) {
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
  return statsHtml;
}

function generateOpenCardContent(capitalizedPokemonName, typesHtml, flavorText, statsHtml, pokemon, backgroundColor) {
  return `
    <div class="open-card-content" style="position: relative;">
      <div class="arrow-left">
        <img src="img/arrow-left.png" alt="leftArrow" />
      </div>
      <div class="card" style="width: 18rem; background-color: ${backgroundColor};">
        <div class="pkmName mb-15">${capitalizedPokemonName}</div>
        <div class="types mb-15">${typesHtml}</div>
        <img class="card-img-top mb-15" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
        <div class="card-body">
          <p class="card-text mb-15">${flavorText}</p>
          ${statsHtml}
        </div>
      </div>
      <div class="arrow-right">
        <img src="img/arrow-right.png" alt="rightArrow" />
      </div>
    </div>
  `;
}
