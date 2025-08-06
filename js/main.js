document.querySelectorAll('#research .item-research a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        // 1. Tomamos el texto del enlace
        const nombre = link.textContent.trim();
        console.log(nombre);
        // 2. Lo guardamos en sessionStorage
        sessionStorage.setItem('selectedResearch', nombre);
        // 3. Navegamos a la página destino
        window.location.href = link.getAttribute('href');
    });
});