const container = document.createElement("div");
container.classList.add("item-container");

function cleanItems() {
    container.innerHTML = "";
}

function copyCommand(id) {
    navigator.clipboard.writeText('/buy item_id:' + id)
        .then(() => {
            alert("Comando copiado para a área de transferência!");
        })
        .catch(error => {
            console.error('Erro ao copiar o comando:', error);
        });
}

function loadColors() {
    cleanItems();

    function createColorElements(bannerData) {
        bannerData.rows.forEach(rowData => {
            const [colorId, colorHex, colorName, colorPrice] = rowData;

            const colorDiv = document.createElement("div");
            colorDiv.classList.add("item");
            colorDiv.style.color = colorHex;

            const nameParagraph = document.createElement("p");
            nameParagraph.innerHTML = `<b>${colorName}</b>`;
            colorDiv.appendChild(nameParagraph);

            const priceParagraph = document.createElement("p");
            priceParagraph.innerHTML = `${colorPrice} <img class="emoji" src="./public/assets/emojis/quartz.png">`;
            colorDiv.appendChild(priceParagraph);

            container.appendChild(colorDiv);

            colorDiv.onclick = function () {
                copyCommand(colorId);
            };
        });

        document.getElementById("shop").appendChild(container);
    }

    fetch('./public//data/tb_colors.json')
        .then(response => response.json())
        .then(jsonData => createColorElements(jsonData))
        .catch(error => console.error('Erro ao carregar o tb_colors.json:', error));
}


function loadTitles() {
    cleanItems();

    function createTitleElements(bannerData) {
        bannerData.rows.forEach(rowData => {
            const [titleId, titleName, titlePrice] = rowData;

            const titleDiv = document.createElement("div");
            titleDiv.classList.add("item");

            const nameParagraph = document.createElement("p");
            nameParagraph.innerHTML = `« <b>${titleName}</b> »`;
            titleDiv.appendChild(nameParagraph);

            const priceParagraph = document.createElement("p");
            priceParagraph.innerHTML = `${titlePrice} <img class="emoji" src="./public/assets/emojis/quartz.png">`;
            titleDiv.appendChild(priceParagraph);

            container.appendChild(titleDiv);

            titleDiv.onclick = function () {
                copyCommand(titleId);
            };
        });

        document.getElementById("shop").appendChild(container);
    }

    fetch('./public//data/tb_titles.json')
        .then(response => response.json())
        .then(jsonData => createTitleElements(jsonData))
        .catch(error => console.error('Erro ao carregar o tb_titles.json:', error));
}

function loadBanners() {
    cleanItems();

    function createBannerElements(bannerData) {
        bannerData.rows.forEach(rowData => {
            const [bannerId, bannerUrl, bannerName, bannerValue, bannerSet] = rowData;

            const bannerDiv = document.createElement("div");
            bannerDiv.classList.add("item");

            const nameParagraph = document.createElement("p");
            nameParagraph.innerHTML = `<b>${bannerName}</b>`;
            bannerDiv.appendChild(nameParagraph);

            const setParagraph = document.createElement("p");
            setParagraph.innerHTML = `<i>${bannerSet}</i>`;
            bannerDiv.appendChild(setParagraph);

            const priceParagraph = document.createElement("p");
            priceParagraph.innerHTML = `${bannerValue} <img class="emoji" src="./public/assets/emojis/quartz.png">`;
            bannerDiv.appendChild(priceParagraph);

            const imageElement = document.createElement("img");
            imageElement.src = bannerUrl;
            imageElement.alt = bannerName;
            imageElement.style.maxWidth = "100%";
            imageElement.style.borderRadius = "10px";
            bannerDiv.appendChild(imageElement);

            container.appendChild(bannerDiv);

            bannerDiv.onclick = function () {
                copyCommand(bannerId);
            };
        });

        document.getElementById("shop").appendChild(container);
    }

    fetch('./public//data/tb_banners.json')
        .then(response => response.json())
        .then(jsonData => createBannerElements(jsonData))
        .catch(error => console.error('Erro ao carregar o tb_banners.json:', error));
}
