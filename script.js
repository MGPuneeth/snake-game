const board = document.querySelector(".board");
const startGame = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const restartModal = document.querySelector(".game-over");
const restartGame = document.querySelector(".btn-restart");
const highscoreDisplay = document.querySelector("#high-score");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerId = null;

let food = {
  r: Math.floor(Math.random() * rows),
  c: Math.floor(Math.random() * cols),
};

const blocks = [];

let snake = [
  { r: 1, c: 3 },
  //   { r: 1, c: 4 },
  //   { r: 1, c: 5 },
];

let direction = "right";

let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let time = `00:00`;

highscoreDisplay.innerHTML = highScore;

// for (let i = 0; i < rows * cols; i++) {
//   const block = document.createElement("div");
//   block.classList.add("block");
//   board.appendChild(block);
// }

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    // block.innerText = `${row}-${col}`;

    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.r}-${food.c}`].classList.add("food");

  if (direction === "left") {
    head = { r: snake[0].r, c: snake[0].c - 1 };
    console.log("left");
  } else if (direction === "right") {
    head = { r: snake[0].r, c: snake[0].c + 1 };
    console.log("right");
  } else if (direction === "up") {
    head = { r: snake[0].r - 1, c: snake[0].c };
    console.log("up");
  } else if (direction === "down") {
    head = { r: snake[0].r + 1, c: snake[0].c };
    console.log("down");
  }

  //============Eat food===========

  if (head.r === food.r && head.c === food.c) {
    blocks[`${food.r}-${food.c}`].classList.remove("food");
    food = {
      r: Math.floor(Math.random() * rows),
      c: Math.floor(Math.random() * cols),
    };
    snake.unshift(head);

    score++;
    scoreDisplay.innerHTML = score;

    if (highScore < score) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
      highscoreDisplay.innerHTML = highScore;
    }

    blocks[`${food.r}-${food.c}`].classList.add("food");
  }

  //   ==== END GAME ====

  if (head.r < 0 || head.r >= rows || head.c < 0 || head.c >= cols) {
    // alert("Game over ... !");
    modal.classList.remove("hide");
    restartModal.classList.remove("hide");
    startModal.classList.add("hide");

    clearInterval(intervalId);
    return;
  }

  snake.forEach((segment) => {
    blocks[`${segment.r}-${segment.c}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    // console.log(segment);

    // console.log(blocks[`${segment.c}-${segment.r}`]);

    blocks[`${segment.r}-${segment.c}`].classList.add("fill");
  });
}

// ========= Start game ===

startGame.addEventListener("click", () => {
  //   modal.style.display = "none";
  modal.classList.add("hide");

  intervalId = setInterval(() => {
    render();
  }, 400);

  timerId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec == 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${min}:${sec}`;
    timeDisplay.innerHTML = time;
  }, 1000);
});

// ==== Restart game ====
restartGame.addEventListener("click", restartTheGame);

function restartTheGame() {
  modal.classList.add("hide");
  blocks[`${food.r}-${food.c}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.r}-${segment.c}`].classList.remove("fill");
  });

  score = 0;
  scoreDisplay.innerHTML = score;
  time = `00:00`;
  timeDisplay.innerHTML = time;
  highscoreDisplay.innerHTML = highScore;

  snake = [
    { r: 1, c: 3 },
    //   { r: 1, c: 4 },
    //   { r: 1, c: 5 },
  ];

  food = {
    r: Math.floor(Math.random() * rows),
    c: Math.floor(Math.random() * cols),
  };

  direction = "right";
  intervalId = setInterval(() => {
    render();
  }, 400);
}

addEventListener("keydown", (event) => {
  console.log(event.key);

  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    default:
      direction = "right";
      break;
  }
});
