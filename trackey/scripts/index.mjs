import {
  capitalizeFirstLetter,
  daysBetweenDates,
  with2Decimals,
} from "./util/util.mjs";
import { openModal } from "../components/add-transaction-modal.js";
import { clearDatabase } from "./util/database.js";
import { refreshChart } from "./my-graphs.js";

// Buttons
const btnAddNewTransaction = document.getElementById("new-transaction-btn");
const btnClearDatabase = document.getElementById("btn-clear-database");
// Text Elements
const greetingTitle = document.getElementById("greeting-title");
const totalIncomeP = document.getElementById("total-income");
const totalExpensesP = document.getElementById("total-expenses");
const transactionList = document.getElementById("transaction-list");

/////////////////////
// Event Handlers //
///////////////////
const handleButtonAddNewTransaction = () => {
  openModal();
};

const handleButtonClearDatabase = () => {
  clearDatabase("transactions");
  userProfile.clearProfile();
  renderTransactionList();
  updateChartLabels();
  refreshChart();
};

//////////////
// Methods //
////////////
export const addTransactionToTransactionList = (transactionObject) => {
  let categoryImgURL;
  const category = globalSettings.defaultCategories.find((defaultCategory) => {
    return defaultCategory.category == transactionObject.category;
  });

  if (category === undefined) {
    categoryImgURL = "./images/icons/tag.svg";
  } else {
    categoryImgURL = category.img;
  }

  const date = new Date(transactionObject.date);

  const newRow = `
      <tr data-transaction-id=${transactionObject.id}>
      <td>
      <span class="img-cel">
      <img src=${categoryImgURL} alt="" />
      <span>${transactionObject.category}</span>
      </span>
      </td>
      <td>${transactionObject.description}</td>
      <td>${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</td>
      <td>${transactionObject.amount} €</td>
      <td>
      ${transactionObject.type}
      <div class="${transactionObject.type}-color-tag"></div>
      </td>
      </tr>`;

  transactionList.innerHTML += newRow;
};

const clearTransactionList = () => {
  transactionList.innerHTML = "";
};

export const renderTransactionList = () => {
  clearTransactionList();

  // Sort by date (new to old)
  userProfile.transactions.sort((a, b) => {
    if (daysBetweenDates(a.date, b.date) != 0) {
      return b.date - a.date;
    } else {
      return b.addedAt - a.addedAt;
    }
  });

  userProfile.transactions.forEach((transaction) => {
    addTransactionToTransactionList(transaction);
  });
};

export const updateChartLabels = () => {
  totalIncomeP.innerText = `${with2Decimals(userProfile.budget)} €`;
  totalExpensesP.innerText = `${with2Decimals(userProfile.totalExpenses)} €`;
};

/////////////////////
// Function Calls //
///////////////////
greetingTitle.innerText = `Hello ${capitalizeFirstLetter(
  userProfile.username
)},`;

//////////////////////
// Event Listeners //
////////////////////
btnAddNewTransaction.addEventListener("click", handleButtonAddNewTransaction);

btnClearDatabase.addEventListener("click", handleButtonClearDatabase);
