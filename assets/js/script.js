(function AccordionCSS() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<style>
    .accordion__trigger{
      justify-content: space-between;
      align-items:center;
      width: 100%;    
      animation: slide 0.4s ease-in-out; 
    }

    .accordion__icon{
      flex-shrink:0;
      transition: 300ms ease-in-out;
    }
    
    [aria-expanded="true"] .add{
      display:none;
    }

    .minus{
      display:none;
    }

    [aria-expanded="true"] .minus{
      display:block;
    }

    @keyframes slide{
      0% {
        opacity: 0;
        transform: translateX(-9px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes active {
      0% {
        opacity: 0;
        transform: translateX(-5px);
      }

      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .accordion__panel:not([hidden="true"]){
      animation: active 0.4s ease-in-out;
      margin-block-end: 1rem;
    }
    </style>`
  );
})();

class Accordion {
  constructor(element, options) {
    this.acc = element;
    this.options = options || {};
    this.id = Math.random().toString(30).substring(2, 15);
    this.buttons = [...this.acc.querySelectorAll(".accordion__trigger")];
    this.panels = [...this.acc.querySelectorAll(".accordion__panel")];
    this.addContent();
    this.connectEventListeners();
  }

  addContent() {
    this.buttons.forEach((btn, index) => {
      btn.id = `btn-${this.id}-${index}`;
      btn.setAttribute("aria-expanded", "false");
      const plusIcon = `<svg class="accordion__icon add" xmlns="http://www.w3.org/2000/svg" width="30" height="31" fill="none" viewBox="0 0 30 31"><path fill="#AD28EB" d="M15 3.313A12.187 12.187 0 1 0 27.188 15.5 12.203 12.203 0 0 0 15 3.312Zm4.688 13.124h-3.75v3.75a.938.938 0 0 1-1.876 0v-3.75h-3.75a.938.938 0 0 1 0-1.875h3.75v-3.75a.938.938 0 0 1 1.876 0v3.75h3.75a.938.938 0 0 1 0 1.876Z"/></svg>`;
      const minusIcon = `<svg class="accordion__icon minus" xmlns="http://www.w3.org/2000/svg" width="30" height="31" fill="none" viewBox="0 0 30 31"><path fill="#301534" d="M15 3.313A12.187 12.187 0 1 0 27.188 15.5 12.2 12.2 0 0 0 15 3.312Zm4.688 13.124h-9.375a.938.938 0 0 1 0-1.875h9.374a.938.938 0 0 1 0 1.876Z"/></svg>`;

      btn.setAttribute("aria-controls", `panel-${this.id}-${index}`);
      btn.insertAdjacentHTML("beforeend", plusIcon);
      btn.insertAdjacentHTML("beforeend", minusIcon);
    });

    this.panels.forEach((panel, index) => {
      panel.id = `panel-${this.id}-${index}`;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", `btn-${this.id}-${index}`);
      panel.setAttribute("hidden", "true");
    });
  }

  connectEventListeners() {
    this.acc.addEventListener("click", (e) => {
      if (!e.target.classList.contains("accordion__trigger")) return;
      const expanded = e.target.getAttribute("aria-expanded") == "true";
      const index = this.buttons.findIndex((btn) => btn.id === e.target.id);

      // !Option for one panel
      if (this.options.onePanel) {
        this.panels.forEach((panel) => {
          panel.setAttribute("hidden", "true");
        });
      }

      if (expanded) {
        e.target.setAttribute("aria-expanded", "false");
        this.panels[index].setAttribute("hidden", "true");
      }
      if (!expanded) {
        e.target.setAttribute("aria-expanded", "true");
        this.panels[index].removeAttribute("hidden");
      }
    });

    // !Keyboard events
    this.acc.addEventListener("keydown", (e) => {
      if (!e.target.classList.contains("accordion__trigger")) return;
      const index = this.buttons.findIndex((btn) => btn.id === e.target.id);

      //  !switch statement
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.buttons[0].focus();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.buttons[this.buttons.length - 1].focus();
          break;
        case "ArrowUp":
          if (index === 0) {
            this.buttons[this.buttons.length - 1].focus();
          } else {
            this.buttons[index - 1].focus();
          }
          e.preventDefault();
          break;
        case "ArrowDown":
          if (index === this.buttons.length - 1) {
            this.buttons[0].focus();
          } else {
            this.buttons[index + 1].focus();
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    });
  }
}

// !createAccordion function
export default function createAccordion(element, options) {
  document.querySelectorAll(element).forEach((accordion) => {
    new Accordion(accordion, options);
  });
}

// !Attribution tooltip
const btn = document.querySelector("[data-js-button]"),
  tooltip = document.querySelector("[data-js-tooltip]");
let isExpanded = !btn.getAttribute("aria-expanded");

const open = (active) => {
  tooltip.setAttribute("aria-expanded", active);
  btn.setAttribute("aria-expanded", active);
};

// !add event listener
btn.addEventListener("click", () => {
  isExpanded = !isExpanded;
  open(isExpanded);
});

// ! when you click somewhere else on tooltip will close
document.addEventListener("click", (t) => {
  if (
    !t.target.closest(".attribution__btn") &&
    !t.target.closest(".social__list")
  ) {
    isExpanded = false;
    open(isExpanded);
  }
});

// !tooltip is opened and ESC is pressed the tooltip is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    isExpanded = false;
    open(isExpanded);
  }
});
