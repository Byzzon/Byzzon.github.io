import { renderTransactionList, updateChartLabels } from "../scripts/index.mjs";
import { refreshChart } from "../scripts/my-graphs.js";
import { addTransactionToDB } from "../scripts/util/database.js";
import { with2Decimals } from "../scripts/util/util.mjs";
import Transaction from "../scripts/util/Transaction.js";
import {
  showAddNewCategoryMenu,
  hideAddNewCategoryMenu,
} from "./add-new-category-menu.js";

// Modal Elements
export const modal = document.getElementById("myModal");
export const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const categoryImg = document.getElementById("category-img");
const modalErrorMsg = document.getElementById("modal-error-message");
const categoryModal = document.querySelector(".category-modal");
// Buttons
const btnClose = document.getElementsByClassName("close")[0];
const btnSelectExpense = document.getElementById("modal-select-expense");
const btnSelectIncome = document.getElementById("modal-select-income");
const btnAddTransaction = document.getElementById("add-transaction-btn");
// Input Elements
const inputAmount = document.getElementById("amount-input");
const inputDate = document.getElementById("input-date");
const inputCategory = document.getElementById("category-input");
const inputDescription = document.getElementById("transaction-description");
// Enums
export const Menu = Object.freeze({
  ADD_TRANSACTION: "addTransaction",
  SELECT_CATEGORY: "selectCategory",
  ADD_NEW_CATEGORY: "addNewCategory",
});
// Util
export class Modal {
  static currentMenu;
}
Modal.currentMenu = Menu.ADD_TRANSACTION;
let selectedTransactionType = Transaction.TransactionType.INCOME;

export const setActiveMenu = (menu) => {
  console.log(modal.dataset.activeMenu);
};

/////////////////////
// Event Handlers //
///////////////////
const handleClickOutsideModal = (event) => {
  if (event.target == modal) {
    closeModal();
  }
};

const handleButtonClose = () => {
  if (Modal.currentMenu === Menu.SELECT_CATEGORY) {
    hideSelectCategory();
    showAddTransaction();
  } else if (Modal.currentMenu === Menu.ADD_TRANSACTION) {
    closeModal();
  } else if (Modal.currentMenu === Menu.ADD_NEW_CATEGORY) {
    hideAddNewCategoryMenu();
    showSelectCategory();
  }
};

const handleButtonIncome = () => {
  setIncomeButtonActive();
  selectedTransactionType = Transaction.TransactionType.INCOME;
};

const handleButtonExpense = () => {
  setExpenseButtonActive();
  selectedTransactionType = Transaction.TransactionType.EXPENSE;
};

const handleInputCategory = () => {
  showSelectCategory();
};

const handleButtonAddTransaction = () => {
  let transactionAmount = Number(inputAmount.value);

  if (transactionAmount <= 0) {
    showModalError("Amount must be higher than 0");
    return;
  }

  if (inputDescription.value === "") {
    showModalError("Please add a description");
    return;
  }

  if (inputCategory.value === "") {
    showModalError("Please select a category");
    return;
  }

  switch (selectedTransactionType) {
    case Transaction.TransactionType.INCOME:
      if (userProfile.addMoney(transactionAmount)) {
        registerTransaction();
      } else {
      }
      break;
    case Transaction.TransactionType.EXPENSE:
      if (userProfile.subtractMoney(transactionAmount)) {
        registerTransaction();
      } else {
        showModalError("Insufficient funds, check your budget");
      }
    default:
      break;
  }
};

const handleButtonAddNewCategory = () => {
  showAddNewCategoryMenu();
};

////////////////////////////
// Add Transaction Logic //
//////////////////////////
const showModalError = (message) => {
  modalErrorMsg.classList.add("error-msg-active");
  modalErrorMsg.classList.remove("error-msg-hidden");
  modalErrorMsg.innerText = message;

  setTimeout(() => {
    hideModalError();
  }, 3000);
};

const hideModalError = () => {
  modalErrorMsg.innerText = "";
  modalErrorMsg.classList.add("error-msg-hidden");
  modalErrorMsg.classList.remove("error-msg-active");
};

const registerTransaction = () => {
  const transactionObject = getTransactionObject();
  userProfile.transactions.push(transactionObject);
  addTransactionToDB(transactionObject);
  userProfile.totalTransactions += 1;
  refreshChart();
  updateChartLabels();
  renderTransactionList();
  clearInputs();
};

const showSelectCategory = () => {
  hideAddTransaction();
  modalTitle.innerText = "Select Category";
  categoryModal.style.display = "grid";
  Modal.currentMenu = Menu.SELECT_CATEGORY;
};

export const hideSelectCategory = () => {
  categoryModal.style.display = "none";
};

export const showAddTransaction = () => {
  hideSelectCategory();
  modalBody.style.display = "flex";
  modalTitle.innerText = "Add Transaction";
  Modal.currentMenu = Menu.ADD_TRANSACTION;
};

const hideAddTransaction = () => {
  modalBody.style.display = "none";
};

const closeModal = () => {
  hideAddNewCategoryMenu();
  modal.style.display = "none";
  Modal.currentMenu = Menu.ADD_TRANSACTION;
  clearInputs();
};

export const openModal = () => {
  modal.style.display = "block";
  showAddTransaction();
};

const setIncomeButtonActive = () => {
  btnSelectIncome.classList.add("bg-green");
  btnSelectIncome.classList.remove("hoverable");
  btnSelectExpense.classList.remove("bg-red");
  btnSelectExpense.classList.add("hoverable");
};

const setExpenseButtonActive = () => {
  btnSelectExpense.classList.add("bg-red");
  btnSelectExpense.classList.remove("hoverable");
  btnSelectIncome.classList.remove("bg-green");
  btnSelectIncome.classList.add("hoverable");
};

const getTransactionObject = () => {
  let transaction = new Transaction(
    Date.now(),
    with2Decimals(inputAmount.value),
    inputDescription.value,
    inputCategory.value,
    Date.parse(inputDate.value),
    selectedTransactionType === Transaction.TransactionType.INCOME
      ? Transaction.TransactionType.INCOME
      : Transaction.TransactionType.EXPENSE
  );

  return transaction;
};

const setCategoryInput = (category) => {
  inputCategory.value = category;
};

const setCategoryImg = (imgURL) => {
  categoryImg.src = imgURL;
};

const clearInputs = () => {
  inputAmount.value = "";
  inputDescription.value = "";
  setInputDateToday();
  inputCategory.value = "";
  setCategoryImg("./images/icons/tag.svg");
};

////////////////////////////
// SELECT CATEGORY LOGIC //
//////////////////////////
const addCategories = () => {
  // Add new category button
  categoryModal.innerHTML += `
  <div id="btn-add-new-category" class="category-item hoverable border-grey">
    <img src="./images/icons/add_circle.svg" alt="" />
    <p>Add New</p>
  </div>`;

  // Other categories
  globalSettings.defaultCategories.forEach((category) => {
    categoryModal.innerHTML += ` 
    <div name="category-item" class="category-item hoverable" data-category=${category.category} data-category-img=${category.img}>
      <img src=${category.img} alt="" />
      <p>${category.category}</p>
    </div>`;
  });

  document.getElementsByName("category-item").forEach((element) => {
    element.addEventListener("click", (e) => {
      const category = element.dataset.category;
      const imgUrl = element.dataset.categoryImg;
      onCategorySelected(category, imgUrl);
    });
  });

  const button = document.getElementById("btn-add-new-category");
  button.addEventListener("click", handleButtonAddNewCategory);
};

const onCategorySelected = (category, imgUrl) => {
  setCategoryInput(category);
  setCategoryImg(imgUrl);
  hideSelectCategory();
  showAddTransaction();
};

const setInputDateToday = () => {
  const dt = new Date();
  const day = ("0" + dt.getDate()).slice(-2);
  const month = ("0" + (dt.getMonth() + 1)).slice(-2);
  const date = dt.getFullYear() + "-" + month + "-" + day;

  inputDate.value = date;
};

/////////////////////
// Function Calls //
///////////////////
setIncomeButtonActive();
addCategories();
setInputDateToday();

//////////////////////
// Event Listeners //
////////////////////
btnClose.addEventListener("click", handleButtonClose);

window.addEventListener("mousedown", (event) => {
  handleClickOutsideModal(event);
});

btnSelectIncome.addEventListener("click", handleButtonIncome);

btnSelectExpense.addEventListener("click", handleButtonExpense);

inputCategory.addEventListener("click", handleInputCategory);

btnAddTransaction.addEventListener("click", handleButtonAddTransaction);
