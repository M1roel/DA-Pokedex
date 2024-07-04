let limit = 10;
let offset = 0;
let storedPokemons = [];
let currentIndex = 0;
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

const contentDiv = document.querySelector(".content");
const openCardDiv = document.getElementById("open-card");
const body = document.querySelector("body");
const arrows = document.querySelector(".arrows");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const searchInputElem = document.getElementById("searchInput");
const pokeballIcon = document.getElementById("pokeballIcon");
const loadMoreBtn = document.querySelector(".load-more-btn");
const loadingScreen = document.querySelector(".loadingScreen");