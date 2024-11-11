// Função para abrir o hambúrguer
function toggleNavbar() {
    var menu = document.getElementById('menu');
    var menuIcon = document.getElementById('menuIcon');
    menu.classList.toggle('open');
    menuIcon.classList.toggle('open');
}

// Criação do contêiner principal para os itens
const container = document.createElement("div");
container.classList.add("item-container");

// Função para limpar o contêiner de itens
function cleanItems() {
    container.innerHTML = "";
}

// Função para copiar o comando específico para a área de transferência
async function copyCommand(rowData) {
    // Definição das variáveis de ID, tipo e nome
    var id = rowData[0],
        type,
        name = rowData[1],
        collection = await searchCollectionName(rowData[4]);

    // Determinação do tipo com base no ID
    if (id >= 100 && id < 200) {
        type = "Cor";
    } else if (id >= 200 && id < 300) {
        type = "Emblema";
    } else if (id >= 300 && id < 400) {
        type = "Banner";
    } else if (id >= 400 && id < 500) {
        type = "Título";
    }

    // Copia o comando formatado para a área de transferência
    navigator.clipboard.writeText(`/item buy item:${type}: ${name} (${collection})`)
        .then(() => {
            alert("Comando copiado para a área de transferência!");
        })
        .catch(error => {
            console.error('Erro ao copiar o comando: ', error);
        });
}

// Função para criar os elementos comuns dos itens
function createCommonElements(rowData, additionalElements, isBanner = false) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    // Adiciona dados ou imagens com base no tipo de dado
    rowData.forEach(data => {
        if (typeof data === 'string' && data.includes('http')) {
            const imageElement = document.createElement("img");
            imageElement.src = data;
            imageElement.alt = data;
            imageElement.style.maxWidth = isBanner ? "100%" : "10%";
            imageElement.style.borderRadius = "10px";
            itemDiv.appendChild(imageElement);
        } else {
            const paragraph = document.createElement("p");
            paragraph.innerHTML = data;
            itemDiv.appendChild(paragraph);
        }
    });

    // Adiciona elementos adicionais se houver
    additionalElements.forEach(element => itemDiv.appendChild(element));

    return itemDiv;
}

// Variáveis globais para armazenar dados e funções atuais
let currentData = [];
let currentUrl = '';
let currentMappingFunc = null;
let currentAdditionalElementsFunc = null;
let currentIsBanner = false;

// Função para carregar itens de uma URL específica e renderizar no contêiner
function loadItems(url, dataMappingFunc, additionalElementsFunc, isBanner = false) {
    cleanItems();
    currentUrl = url;
    currentMappingFunc = dataMappingFunc;
    currentAdditionalElementsFunc = additionalElementsFunc;
    currentIsBanner = isBanner;

    // Busca os dados da URL e armazena-os
    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentData = data.rows;
            renderItems();
        })
        .catch(error => console.error(`Erro ao carregar o ${url}:`, error));
}

// Função para renderizar e ordenar itens no contêiner
function renderItems() {
    cleanItems();

    // Obtém a ordem de classificação do elemento de seleção
    const sortOrder = document.getElementById("sort").value;
    let sortedData = [...currentData];

    // Aplica a classificação apropriada
    if (sortOrder === "alphabetical") {
        sortedData.sort((a, b) => a[2].toString().localeCompare(b[2].toString()));
    } else if (sortOrder === "price") {
        sortedData.sort((a, b) => parseFloat(a[3]) - parseFloat(b[3]));
    } else if (sortOrder === "collection") {
        sortedData.sort((a, b) => b[4].toString().localeCompare(a[4].toString()));
    }

    // Adiciona cada item ao contêiner
    sortedData.forEach(async rowData => {
        const additionalElements = currentAdditionalElementsFunc ? currentAdditionalElementsFunc(rowData) : [];
        const itemDiv = createCommonElements(await currentMappingFunc(rowData), additionalElements, currentIsBanner);
        itemDiv.onclick = () => copyCommand(rowData);
        container.appendChild(itemDiv);
    });

    document.getElementById("shop").appendChild(container);
}

// Função para reordenar os itens
function sortItems() {
    renderItems();
}

// Funções para carregar diferentes tipos de itens com mapeamento específico
function loadColors() {
    loadItems('./public/data/tb_colors.json', rowData => [
        `<b>${rowData[1]}</b>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[6]
    ]);
}

function loadTitles() {
    loadItems('./public/data/tb_titles.json', async rowData => [
        `« <b>${rowData[1]}</b> »`,
        `<i>${await searchCollectionName(rowData[4])}</i>`,
        `${rowData[2]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
    ]);
}

async function loadBanners() {
    loadItems('./public/data/tb_banners.json', async rowData => [
        `<b>${rowData[1]}</b>`,
        `<i>${await searchCollectionName(rowData[4])}</i>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[2]
    ], null, true);
}

function loadPins() {
    loadItems('./public/data/tb_pins.json', async rowData => [
        `<b>${rowData[1]}</b>`,
        `<i>${await searchCollectionName(rowData[4])}</i>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[5]
    ]);
}

// Função para buscar o nome da coleção com base no ID da coleção
async function searchCollectionName(collectionId) {
    try {
        const response = await fetch('./public/data/tb_collections.json');
        const data = await response.json();
        const collection = data.rows.find(row => row[0] === Number(collectionId));
        return collection ? collection[1] : 'Collection not found.';
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
        return 'Error loading collection name.';
    }
}

// Função para carregar os comandos em uma tabela
