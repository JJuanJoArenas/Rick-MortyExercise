let charactersList = [];
const detailsModal = document.getElementById('details-modal');
const closeBtn = document.querySelector('.close-btn');
const modalDetailsContainer = document.getElementById('modal-character-details');
const charactersTbody = document.getElementById('characters-tbody');
const randomBtn = document.getElementById('random-btn');

function openModal(characterData) {
    if (!characterData) return;
    modalDetailsContainer.innerHTML = `
        <img src="${characterData.image}" alt="Imagen de ${characterData.name}" class="modal-character-image">
        <table>
            <tbody>
                <tr>
                    <td><strong>Nombre:</strong></td>
                    <td>${characterData.name}</td>
                </tr>
                <tr>
                    <td><strong>Tipo:</strong></td>
                    <td>${characterData.type || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Origen:</strong></td>
                    <td>${characterData.origin.name}</td>
                </tr>
            </tbody>
        </table>
    `;
    detailsModal.style.display = 'flex';
}

function closeModal() {
    detailsModal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === detailsModal) {
        closeModal();
    }
});

function getCharacters(count = 10, maxId = 826) {
    const ids = new Set();
    while (ids.size < count) {
        ids.add(Math.floor(Math.random() * maxId) + 1);
    }
    return Array.from(ids);
}

async function fetchCharacters() {
    const randomIds = getCharacters();
    const url = `https://rickandmortyapi.com/api/character/${randomIds.join(',')}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        charactersList = Array.isArray(data) ? data : [data];
        charactersTbody.innerHTML = '';
        charactersList.forEach(character => {
            const row = `
                <tr>
                    <td>${character.id}</td>
                    <td>${character.name}</td>
                    <td>${character.species}</td>
                    <td>${character.status}</td>
                    <td><button class="table-details-btn" data-character-id="${character.id}">Ver detalles</button></td>
                </tr>
            `;
            charactersTbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al obtener el personaje:', error);
        charactersTbody.innerHTML = `<tr><td colspan="5">Error al cargar los personajes.</td></tr>`;
    }
}

charactersTbody.addEventListener('click', (event) => {
    if (event.target.classList.contains('table-details-btn')) {
        const characterId = event.target.dataset.characterId;
        const characterData = charactersList.find(char => char.id == characterId);
        if (characterData) {
            openModal(characterData);
        }
    }
});
randomBtn.addEventListener('click', fetchCharacters);
fetchCharacters();