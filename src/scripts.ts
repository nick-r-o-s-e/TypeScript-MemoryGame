const indentifiers: string[] = [];

let cardsOpened = 0;
let openedCard: (number | string)[] = [];
let rightGuessedCardsIndexes: number[] = [];

const difficulties = [3, 6, 12, 24];

const mainContainer = document.querySelector<HTMLDivElement>(".memory-game");

const cardField = document.createElement("div");
cardField.classList.add("cards-field");
mainContainer.appendChild(cardField);

let cardsDivs: NodeListOf<HTMLDivElement>;

const setOfColors = [
  "red",
  "yellow",
  "green",
  "orange",
  "pink",
  "purple",
  "blue",
  "tan",
  "brown",
  "aqua",
  "chartreuse",
  "darkcyan",
];

const colors = [...setOfColors, ...setOfColors]; // 12 COLORS X2(to have 2 sets of the same 6 pairs for last level(24 cards))

const shuffle = (cards: string[]) => {
  //ARRAY SHUFFLE HELPER
  var i = 0,
    j = 0,
    temp = null;

  for (i = cards.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
};

const setup: (string | number)[] = []; //TRACK CHOSEN SETTINGS FOR startGame() function

// const countOfGuessesElement = document.querySelector(".count");
// let count = 0;

const displaySettings = () => {
  const modeSettings = <HTMLDivElement>(
    document.querySelector(`.settings--mode`)
  );
  const levelSettings = <HTMLDivElement>(
    document.querySelector(`.settings--level`)
  );

  cardField.appendChild(modeSettings);
  cardField.appendChild(levelSettings);

  const modeOptions = modeSettings
    .querySelector(".options")
    .querySelectorAll("h1");
  const levelOptions = levelSettings
    .querySelector(".options")
    .querySelectorAll("h1");

  modeSettings.style.display = "flex";

  modeOptions.forEach((mode, index) => {
    mode.addEventListener("click", () => {
      modeSettings.style.display = "none";

      setup.push(index == 0 ? "colors" : "pictures");

      levelSettings.style.display = "flex";
      levelOptions.forEach((level, index) => {
        level.addEventListener("click", () => {
          levelSettings.style.display = "none";
          setup.push(index);
          console.log(setup);

          startGame(indentifiers, Number(setup[1]), String(setup[0]));
        });
      });
    });
  });
};

const initializeGame = () => {
  const startBtn = document.createElement("h1");
  startBtn.classList.add("start");
  const innnerText = document.createTextNode("START");
  startBtn.appendChild(innnerText);
  cardField.appendChild(startBtn);
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    displaySettings();
  });
};
initializeGame();

const arrayEqualsCheck = (
  arr1: (string | number)[],
  arr2: (string | number)[]
) => arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

const startGame = (indentifiers: string[], dif: number, mode: string) => {
  document.querySelector("body").style.background =
    "#1d0042 url('https://www.transparenttextures.com/patterns/gplay.png')";

  for (let i = 0; i < difficulties[dif]; i++) {
    indentifiers.push(colors[i]);
    indentifiers.push(colors[i]);
  }
  shuffle(indentifiers);
  console.log(indentifiers);

  cardField.style.gridTemplateColumns = `repeat(${
    //CREATE DIMENSIONS OF THE GRID FOR EACH LEVEL
    difficulties[dif] / 2 < 3
      ? 3
      : difficulties[dif] / 2 == 3
      ? 4
      : Math.round(difficulties[dif] / 2)
  }, 1fr)`;

  indentifiers.forEach((indentifier, index) => {
    const cardDiv = document.createElement("div");
    const cardInner = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardFront = document.createElement("div");

    cardDiv.classList.add("flip-card");

    cardInner.classList.add("flip-card-inner");
    cardBack.classList.add("flip-card-back");
    cardFront.classList.add("flip-card-front");

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardDiv.appendChild(cardInner);

    const firstOccurrenceIndex = indentifiers.findIndex(
      (c) => c == indentifier
    );
    const isFirstCardOfPair = firstOccurrenceIndex == index;

    if (mode == "colors") {
      cardBack.style.backgroundColor = indentifier;
    } else {
      if (isFirstCardOfPair) {
        cardBack.classList.add(indentifier);
        cardBack.style.backgroundImage = `url(https://picsum.photos/400/600/?random&t=${index})`;
      } else {
        cardBack.classList.add(indentifier);
        const otherCardOfPair = <HTMLDivElement>(
          cardField.children[firstOccurrenceIndex + 3]
        );
        const back = <HTMLDivElement>(
          otherCardOfPair.querySelector(".flip-card-back")
        );
        cardBack.style.backgroundImage = back.style.backgroundImage;
      }
    }

    cardField.appendChild(cardDiv);
  });

  cardsDivs = document.querySelectorAll<HTMLDivElement>(".flip-card");
  cardsDivs.forEach?.((card, index) => {
    card.addEventListener("click", () => {
      handleCardClick(card, index, mode, dif);
    });
  });

  //   initialDisplay(cards);
};

const handleCardClick = (
  cardDiv: HTMLDivElement,
  index: number,
  mode: string,
  dif: number
) => {
  cardDiv.classList.add("opened");

  cardDiv.style.pointerEvents = "none";

  const removeCards = (...indexes: number[]) => {
    indexes.forEach((index) => {
      cardsDivs[index].style.transition = "transform 0.4s ease";
      cardsDivs[index].style.transform = `scale(1.1,1.1)`;
      setTimeout(() => {
        cardsDivs[index].style.transition =
          "opacity 0.5s linear, transform 0.6s ease-in";
        cardsDivs[index].style.opacity = "0";
        cardsDivs[index].style.pointerEvents = "none";

        cardsDivs[index].style.transform = `scale(0.2,0.2) ${
          dif == 3 ? "" : "rotate(450deg)"
        }`;
      }, 300);
    });
  };
  const hideCards = (...indexes: number[]) => {
    indexes.forEach((index) => {
      cardsDivs[index].classList.remove("opened");
    });
  };

  const enableNotGuessedCards = () => {
    cardsDivs.forEach((card, index) => {
      if (!rightGuessedCardsIndexes.includes(index)) {
        card.style.pointerEvents = "auto";
      }
    });
  };

  const disableAllCards = () => {
    cardsDivs.forEach((card) => {
      card.style.pointerEvents = "none";
    });
  };

  const resetOpenedCards = () => {
    cardsOpened = 0;
    openedCard = [];
  };

  const cardBack = <HTMLDivElement>cardDiv.querySelector(".flip-card-back");

  const indentifier =
    mode == "colors"
      ? cardBack.style.backgroundColor
      : cardBack.classList.value.split(" ").at(-1);

  const pickedCard: (string | number)[] = [index, indentifier];

  if (cardsOpened == 0) {
    // countOfGuessesElement.innerHTML = String(++count);
    openedCard = [index, indentifier];
    cardsOpened++;
  } else if (arrayEqualsCheck(pickedCard, openedCard)) {
  } else if (pickedCard[1] == openedCard[1]) {
    // countOfGuessesElement.innerHTML = String(++count);
    disableAllCards();
    rightGuessedCardsIndexes.push(Number(openedCard[0]), Number(pickedCard[0]));

    setTimeout(() => {
      removeCards(Number(openedCard[0]), Number(pickedCard[0]));

      resetOpenedCards();
      enableNotGuessedCards();
      if (rightGuessedCardsIndexes.length == indentifiers.length) {
        setTimeout(() => {
          displayWinner();
        }, 1200);
      }
    }, 1300);
  } else {
    // countOfGuessesElement.innerHTML = String(++count);
    disableAllCards();
    setTimeout(() => {
      hideCards(Number(openedCard[0]), Number(pickedCard[0]));

      resetOpenedCards();

      enableNotGuessedCards();
    }, 1700);
  }
};

const displayWinner = () => {
  for (let i = 0; i < indentifiers.length; i++) {
    cardField.removeChild(document.querySelector(".flip-card"));
  }
  const body = document.querySelector("body");
  body.style.background = "url('assets/images/gif-bg.gif') no-repeat center";
  body.style.backgroundSize = "cover";
  body.style.height = "100vh";

  const winner = document.createElement("h1");
  winner.classList.add("start");
  winner.appendChild(document.createTextNode("WINNER"));
  winner.addEventListener("click", resetGame);

  cardField.style.display = "none";
  body.querySelector(".memory-game").appendChild(winner);
};

const resetGame = () => {
  // count = 0;
  // countOfGuessesElement.innerHTML = String(count);
  location.reload();
};

const restartBtn = document.querySelector(".reset");
restartBtn.addEventListener("click", resetGame);
