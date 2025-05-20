const toggleBtn = document.getElementById("toggleSidebarBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("expanded");
});