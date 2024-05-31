const container = document.createElement("div");
container.classList.add("item-container");

function cleanItems() {
    container.innerHTML = "";
}

function copyCommand(id) {
    navigator.clipboard.writeText(`/item buy item_id:${id}`)
        .then(() => {
            alert("Comando copiado para a área de transferência!");
        })
        .catch(error => {
            console.error('Erro ao copiar o comando:', error);
        });
}

function createCommonElements(rowData, additionalElements, isBanner = false) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

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

    additionalElements.forEach(element => itemDiv.appendChild(element));

    return itemDiv;
}

let currentData = [];
let currentUrl = '';
let currentMappingFunc = null;
let currentAdditionalElementsFunc = null;
let currentIsBanner = false;

function loadItems(url, dataMappingFunc, additionalElementsFunc, isBanner = false) {
    cleanItems();
    currentUrl = url;
    currentMappingFunc = dataMappingFunc;
    currentAdditionalElementsFunc = additionalElementsFunc;
    currentIsBanner = isBanner;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentData = data.rows;
            renderItems();
        })
        .catch(error => console.error(`Erro ao carregar o ${url}:`, error));
}

function renderItems() {
    cleanItems();

    const sortOrder = document.getElementById("sort").value;
    let sortedData = [...currentData];

    if (sortOrder === "alphabetical") {
        sortedData.sort((a, b) => a[2].toString().localeCompare(b[2].toString()));
    } else if (sortOrder === "price") {
        sortedData.sort((a, b) => parseFloat(a[3]) - parseFloat(b[3]));
    } else if (sortOrder === "collection") {
        sortedData.sort((a, b) => b[4].toString().localeCompare(a[4].toString()));
    }

    sortedData.forEach(async rowData => {
        const additionalElements = currentAdditionalElementsFunc ? currentAdditionalElementsFunc(rowData) : [];
        const itemDiv = createCommonElements(await currentMappingFunc(rowData), additionalElements, currentIsBanner);
        itemDiv.onclick = () => copyCommand(rowData[0]);
        container.appendChild(itemDiv);
    });

    document.getElementById("shop").appendChild(container);
}

function sortItems() {
    renderItems();
}

function loadColors() {
    loadItems('./public/data/tb_colors.json', rowData => [
        `<b>${rowData[2]}</b>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[5]
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
        `<b>${rowData[2]}</b>`,
        `<i>${await searchCollectionName(rowData[4])}</i>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[1]
    ], null, true);
}

function loadPins() {
    loadItems('./public/data/tb_pins.json', async rowData => [
        `<b>${rowData[2]}</b>`,
        `<i>${await searchCollectionName(rowData[4])}</i>`,
        `${rowData[3]} <img class="emoji" src="./public/assets/emojis/quartz.png">`,
        rowData[5]
    ]);
}

async function searchCollectionName(collectionId) {
    try {
        const response = await fetch('./public/data/tb_collections.json');
        const data = await response.json();
        const collection = data.rows.find(row => row[0] === Number(collectionId));
        return collection ? collection[1] : 'Collection not found';
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
        return 'Error loading collection name';
    }
}
