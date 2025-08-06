// js/script.js

// Lista de rutas a tus archivos Markdown
const textFiles = [
    'texts/grafos.txt',
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.markdown-container');
    if (!container) {
        console.error('No se encontró el contenedor .markdown-container');
        return;
    }

    // Función asíncrona para cargar y renderizar un solo archivo
    async function loadAndRender(file) {
        try {
            const res = await fetch(file);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const mdText = await res.text();
            // marked.parse o marked() según tu versión
            const html = marked.parse(mdText);

            // Envuelve cada sección en un <section> (opcional)
            const section = document.createElement('section');
            section.classList.add('markdown-section');
            section.innerHTML = html;
            container.appendChild(section);

        } catch (err) {
            console.error(`Error cargando "${file}":`, err);
            const errDiv = document.createElement('div');
            errDiv.textContent = `No se pudo cargar ${file}`;
            errDiv.style.color = 'red';
            container.appendChild(errDiv);
        }
    }

    // Carga secuencial para mantener el orden
    (async () => {
        for (const file of textFiles) {
            await loadAndRender(file);
        }
    })();
});
