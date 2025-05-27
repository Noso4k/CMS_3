document.getElementById('sidebarToggle').addEventListener('click', function() {
    const menu = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebarToggle');
    menu.classList.toggle('active');

    // відкриття меню - кнопка справа меню
    if (menu.classList.contains('active')) {
        if (window.innerWidth <= 620) {
            toggleButton.style.position = 'fixed';
            toggleButton.style.right = '20px'; // В правий край екрану
            toggleButton.style.left = 'auto';
            toggleButton.style.top = '10px';
        } else {
            toggleButton.style.position = 'absolute';
            toggleButton.style.left = '200px'; // В правий край меню
            toggleButton.style.right = 'auto';
            toggleButton.style.top = '10px';
        }
    } else {
        // Закриття меню
        toggleButton.style.position = 'fixed';
        toggleButton.style.left = '1%';
        toggleButton.style.right = 'auto';
        toggleButton.style.top = '1%';
    }
});