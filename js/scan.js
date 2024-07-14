
// This file is used to store the image file that is being scanned
let imageFile = null;
let imageElement = null;

function startup() {
  imageElement = document.getElementById("image");
  imageFile = document.getElementById("library-input");
  imageFile.addEventListener('change', handleFileSelect);
}

function handleFileSelect(event) {
  event.preventDefault();
  console.log("File selected");
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
            const value = line.match(/¥\s?(\d+)/);
            if (value) {
              prices.push(parseInt(value[1]));
            }
          }
        }

        // inverse-sort and remove duplicates
        prices = prices.sort((a, b) => b - a);
        prices = prices.filter((price, index, self) => self.indexOf(price) === index);

        createPriceButtons(prices);
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

  // const priceButtons = document.getElementsByClassName("price-button");
  // for (let i = 0; i < priceButtons.length; i++) {
  //   priceButtons[i].addEventListener("click", function() {
  //     console.log("Price button clicked");
  //   });
}

function addPriceButtonEvent(price) {
  // Save the data to the local storage
  let data = localStorage.getItem("buys");
  if (data) {
    data = JSON.parse(data);
  } else {
    data = [];
  }

  data.push({
    price: price,
    date: new Date().toISOString().split("T")[0],
    kind: "",
  });

  localStorage.setItem("buys", JSON.stringify(data));

  // Clear prices and image
  document.getElementById("prices-container").innerHTML = "";
  document.getElementById("image").src = "";
}

window.addEventListener("load", startup);
