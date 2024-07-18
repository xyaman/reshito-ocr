// This file is used to store the image file that is being scanned
let imageFile = null;
let imageElement = null;
let progressElement = null;

function startup() {
  imageElement = document.getElementById("image");
  imageFile = document.getElementById("library-input");
  imageFile.addEventListener('change', handleFileSelect);

  progressElement = document.getElementById("progress-bar");
}

function handleFileSelect(event) {
  event.preventDefault();
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = e.target.result;
    if (typeof data === 'string') {
      imageElement.setAttribute('src', data);
    }
  }
  reader.readAsDataURL(file);

  // Do ocr
  getTextWithTesseract();
}

// This function is used to get the text from the image
// Note: the image needs to be displayed on the screen
// or at least, the image needs to be loaded
function getTextWithTesseract() {
  progressElement.classList.remove("is-hidden");

  Tesseract.createWorker().then(worker => {
    worker.recognize(imageElement, "jpn")
      .then(({ data }) => {
        console.log(data.text);
        console.log(data);

        let lines = data.text.split("\n");
        let prices = [];

        // parse prices from the text
        for (let line of lines) {
          if (line.includes("¥")) {
            const cleanedLine = line.replace(/[,\s.]/g, '');
            const value = cleanedLine.match(/¥\s?(\d+)/);
            if (value) {
              prices.push(parseInt(value[1]));
            }
          }
        }

        // inverse-sort and remove duplicates
        prices = prices.sort((a, b) => b - a);
        prices = prices.filter((price, index, self) => self.indexOf(price) === index);

        createPriceButtons(prices);
        progressElement.classList.add("is-hidden");
      })
  })
}

// This function is used to create the price buttons
// @param prices: an array of prices (int)
function createPriceButtons(prices) {
  const priceButtons = document.getElementById("prices-container");

  // Clear the price container
  priceButtons.innerHTML = "";

  for (const price of prices) {
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("column", "is-full");

    const priceButton = document.createElement("button");
    priceButton.classList.add("button");
    priceButton.innerHTML = price;

    priceButton.addEventListener("click", () => addPriceButtonEvent(price));

    buttonDiv.appendChild(priceButton);
    priceButtons.appendChild(buttonDiv);

  }
}

function addPriceButtonEvent(price) {
  // document.location.href = `/add.html?price=${price}`;
  // temporal solution
  document.location.href = `/reshito-ocr/add.html?price=${price}`;
}

window.addEventListener("load", startup);
