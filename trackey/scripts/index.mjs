import { capitalizeFirstLetter } from "./util/util.mjs";

const addNewTransactionBtn = document.getElementById("new-transaction-btn");
const greetingTitle = document.getElementById("greeting-title");

// When the user clicks the button, open the modal
addNewTransactionBtn.addEventListener("click", () => {
  modal.style.display = "block";
  showAddTransaction();
});

greetingTitle.innerText = `Hello ${capitalizeFirstLetter(
  userProfile.username
)},`;
