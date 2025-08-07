// js/render-markdown.js
(function() {
    function typesetMath(container) {
        if (window.MathJax) {
            if (typeof MathJax.typesetPromise === 'function') {
                MathJax.typesetPromise([container]).catch(console.error);
            } else if (MathJax.startup && MathJax.startup.promise) {
                MathJax.startup.promise
                    .then(() => MathJax.typesetPromise([container]))
                    .catch(console.error);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const mdContainer = document.getElementById('research-md');
        if (!mdContainer) return;

        // 1) Leer la clave que guardaste antes
        const nombre = sessionStorage.getItem('selectedResearch');
        if (!nombre) {
            mdContainer.innerHTML = '<p>No hay investigación seleccionada.</p>';
            return;
        }

        // 2) Armar el nombre de archivo
        const archivo = `${encodeURIComponent(nombre)}.txt`;

        // 3) Determinar ruta relativa a GitHub Pages
        //    Asume que tu sitio sirve los .txt desde /text/ en la misma raíz.
        //    En GH Pages suelen estar en /<repo>/text/, así que usamos un path relativo:
        const ruta = `./text/${archivo}`;

        let rawMd;
        try {
            const res = await fetch(ruta, { cache: 'no-store' });
            if (!res.ok) throw new Error(res.statusText);
            rawMd = await res.text();
        } catch (err) {
            mdContainer.innerHTML = `<p>Error cargando <strong>${archivo}</strong>: ${err.message}</p>`;
            return;
        }

        // 4) Parsear Markdown a HTML con marked.js
        mdContainer.innerHTML = (typeof marked.parse === 'function')
            ? marked.parse(rawMd)
            : marked(rawMd);

        // 5) Renderizar ecuaciones con MathJax
        typesetMath(mdContainer);

        // 6) (Opcional) limpiar sessionStorage
        // sessionStorage.removeItem('selectedResearch');
    });
})();
