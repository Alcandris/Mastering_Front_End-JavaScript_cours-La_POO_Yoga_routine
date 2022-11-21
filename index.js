const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
let exerciceArray = [];

//Get stored exercices array

(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices); //convertit le json au bon format
  } else {
    exerciceArray = basicArray;
  }
})();

class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    setTimeout(() => {
      if (this.minutes === 0 && this.seconds == "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);

    return (main.innerHTML = `
        <div class="exercice-container">
            <p>${this.minutes}:${this.seconds}</p>
            <img src="./img/${exerciceArray[this.index].pic}.png"/>
            <div>${this.index + 1}/${exerciceArray.length}</div>
        </div>
        `);
  }
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value); //stock le nb de minute pour chaque exo
            this.store(); //this car on est déja dans utils
          }
        });
      });
    });
  },
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            //inversion des lignes du tableau
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            // console.log(position);
            page.loby(); //affichage avec les nouvelles positions
            this.store(); //this car on est déja dans utils
          } else {
            position++;
          }
        });
      });
    });
  },
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArray = exerciceArray.filter((exo) => {
          return exo.pic != e.target.dataset.pic; //filtre les objets avec un id différent de dataset.pic et les mets dans newArray
        });
        exerciceArray = newArray;
        page.loby();
        this.store(); //this car on est déja dans utils
      });
    });
  },
  reboot: function () {
    exerciceArray = basicArray;
    page.loby();
    this.store(); //this car on est déja dans utils
  },
  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray); //stock au format json
  },
};

const page = {
  loby: function () {
    let mapArray = exerciceArray
      .map((exo) => {
        return `
        <li>
            <div class="card-header">
                <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                <span>min</span>
            </div>
            <img src="./img/${exo.pic}.png"/>
            <i class='fas fa-arrow-alt-circle-left arrow' data-pic=${exo.pic}></i>
            <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
        </li>
        `;
      })
      .join("");

    utils.pageContent(
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => {
      this.routine(); //this car on est déja dans page
    });
  },
  routine: function () {
    const exercice = new Exercice();
    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },
  finish: function () {
    utils.pageContent(
      "c'est terminé",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinitialiser <i class='fas fa-time-circle'</i></button>"
    );
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => this.loby());
  },
};

page.loby();
