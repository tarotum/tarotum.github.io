(function mobileNavHandler() {
  if (!document.querySelector("#nav-button")) return;

  const navButton = document.querySelector("#nav-button");
  const nav = document.querySelector(".nav");
  navButton.onclick = function() {
    nav.classList.toggle("nav--fullscreen");
  };
})();
