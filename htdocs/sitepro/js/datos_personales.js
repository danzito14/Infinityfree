const btnToggle = document.querySelector('.toggle-btn');


btnToggle.addEventListener('click', function () {
    document.getElementById('side_bar').classList.toggle('active');
});