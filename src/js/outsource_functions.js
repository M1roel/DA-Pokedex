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
