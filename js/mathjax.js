// Configuración de MathJax
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const researchMd = document.getElementById('research-md');
    if (!researchMd) return;  // Si no existe, salimos

    // 1. Recuperar nombre seleccionado
    const nombre = sessionStorage.getItem('selectedResearch');
    if (!nombre) {
        researchMd.innerHTML = '<p>No hay investigación seleccionada.</p>';
        return;
    }

    // 2. Construir ruta al .txt
    const archivo = encodeURIComponent(nombre) + '.txt';
    const ruta = `${window.location.origin}/text/${archivo}`;

    try {
        // 3. Fetch del archivo
        const res = await fetch(ruta, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const texto = await res.text();

        // 4. Parsear Markdown e inyectar HTML
        //    Usamos marked.parse() para Marked v4+, o marked(texto) en v3
        researchMd.innerHTML = typeof marked.parse === 'function'
            ? marked.parse(texto)
            : marked(texto);

        // 5. Renderizar las ecuaciones con MathJax v3
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([ researchMd ]).catch(console.error);
        }
    } catch (err) {
        console.error(err);
        researchMd.innerHTML = `<p>Error cargando ${archivo}: ${err.message}</p>`;
    } finally {
        // 6. Limpiar la clave para la próxima vez
        // sessionStorage.removeItem('selectedResearch');
    }
});
