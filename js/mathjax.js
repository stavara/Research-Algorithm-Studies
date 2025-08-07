'use strict';

const containerId = 'research-md';
const storageKey  = 'selectedResearch';
const textFolder  = './text/';
const localMarkdownIt = './js/markdown-it.js';

// Función para cargar dinámicamente el script
async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Error cargando script: ${src}`));
        document.head.appendChild(script);
    });
}

async function renderMarkdownText() {
    const container = document.getElementById(containerId);
    if (!container) return;

    //  Markdown-it esté disponible, si no, lo carga otra vez
    if (typeof window.markdownit !== 'function') {
        try {
            await loadScript(localMarkdownIt);
        } catch (err) {
            container.textContent = 'Error cargando Markdown-it: ' + err.message;
            return;
        }
    }

    // Inicializa Markdown-it
    const md = window.markdownit({ html: true, breaks: true });

    // Obtiene el nombre del archivo
    const nombre = sessionStorage.getItem(storageKey);
    if (!nombre) {
        container.innerHTML = '<p>No hay investigación seleccionada.</p>';
        return;
    }

    // Construye URL y descarga el .txt
    const archivo = encodeURIComponent(nombre) + '.txt';
    const url     = textFolder + archivo;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(res.statusText);
        const raw = await res.text();

        // Convierte Markdown a HTML
        const html = md.render(raw);
        container.innerHTML = html;

        // Renderiza las ecuaciones con MathJax
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([container]).catch(console.error);
        }
    } catch (err) {
        container.textContent = `Error cargando "${archivo}": ${err.message}`;
    }
}

window.addEventListener('DOMContentLoaded', renderMarkdownText);
