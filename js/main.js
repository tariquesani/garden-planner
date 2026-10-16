// ─── Init ─────────────────────────────────────────────────────────────────────
initSidebar();
initCanvas();
renderLists();
updateCalibReadout();
setTimeout(loadLocalStoreInputs, 0); // restore saved store name/URL after DOM is ready

// Resize canvas to fill its container whenever the window changes size
new ResizeObserver(() => {
  const area = canvas.parentElement;
  canvas.width  = area.clientWidth;
  canvas.height = area.clientHeight;
  draw();
}).observe(canvas.parentElement);

// ─── Tutorial modal ────────────────────────────────────────────────────────────
function showTutorial() {
  document.getElementById('tutorialModal').classList.remove('hidden');
}
function closeTutorial() {
  const modal = document.getElementById('tutorialModal');
  modal.classList.add('hidden');
  if (document.getElementById('dontShowAgain').checked) {
    localStorage.setItem('gardenPlannerTutorialSeen', '1');
  }
}
// Defer until after the modal HTML (below this script tag) has been parsed
setTimeout(function() {
  if (!localStorage.getItem('gardenPlannerTutorialSeen')) {
    showTutorial();
  }
}, 0);
