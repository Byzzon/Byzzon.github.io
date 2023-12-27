// Modal Elements
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modal-content");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const categoryImg = document.getElementById("category-img");
const categoryModal = document.querySelector(".category-modal");
const modalErrorMsg = document.getElementById("modal-error-message");
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
// External Elements
const totalIncomeP = document.getElementById("total-income");
const totalExpensesP = document.getElementById("total-expenses");
const transactionList = document.getElementById("transaction-list");
// Enums
const TransactionType = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
});
const Menu = Object.freeze({
  ADD_TRANSACTION: "addTransaction",
  SELECT_CATEGORY: "selectCategory",
});
// Global Variables
let currentMenu = Menu.ADD_TRANSACTION;
let transactionType = TransactionType.INCOME;

/////////////////////
// Event Handlers //
///////////////////
const handleClickOutsideModal = (event) => {
  if (event.target == modal) {
    closeModal();
  }
};

const handleButtonClose = () => {
  if (currentMenu === Menu.SELECT_CATEGORY) {
    hideSelectCategory();
    showAddTransaction();
  } else {
    closeModal();
  }
};

const handleButtonIncome = () => {
  setIncomeButtonActive();
  transactionType = TransactionType.INCOME;
};

const handleButtonExpense = () => {
  setExpenseButtonActive();
  transactionType = TransactionType.EXPENSE;
};

const handleInputCategory = () => {
  showSelectCategory();
};

const handleButtonAddTransaction = () => {
  const transaction = {};
  transaction.amount = Number(inputAmount.value);

  if (transaction.amount <= 0 || inputCategory.value === "") {
    return;
  }

  switch (transactionType) {
    case TransactionType.INCOME:
      if (userProfile.addMoney(transaction.amount)) {
        registerTransaction();
      } else {
      }
      break;
    case TransactionType.EXPENSE:
      if (userProfile.subtractMoney(transaction.amount)) {
        registerTransaction();
      } else {
        showModalError("Insufficient funds, check your budget.");
      }
    default:
      break;
  }
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
  userProfile.transactions.push(getTransactionObject());
  userProfile.totalTransactions += 1;
  updateChart();
  updateChartLabels();
  renderTransactionList();
  clearInputs();
};

const updateChartLabels = () => {
  totalIncomeP.innerText = `${userProfile.budget} €`;
  totalExpensesP.innerText = `${userProfile.totalExpenses} €`;
};

const updateChart = () => {
  // Budget
  data.datasets[0].data[1] = userProfile.budget;
  // Expenses
  data.datasets[0].data[0] = userProfile.totalExpenses;
  chart.update();
};

const showSelectCategory = () => {
  hideAddTransaction();
  modalTitle.innerText = "Select Category";
  categoryModal.style.display = "grid";
  currentMenu = Menu.SELECT_CATEGORY;
};

const hideSelectCategory = () => {
  categoryModal.style.display = "none";
};

const showAddTransaction = () => {
  hideSelectCategory();
  modalBody.style.display = "flex";
  modalTitle.innerText = "Add Transaction";
  currentMenu = Menu.ADD_TRANSACTION;
};

const hideAddTransaction = () => {
  modalBody.style.display = "none";
};

const closeModal = () => {
  modal.style.display = "none";
  currentMenu = Menu.ADD_TRANSACTION;
  clearInputs();
};

const subtractBudget = (amount) => {
  if (userProfile.budget - amount >= 0) {
    userProfile.budget -= amount;
    userProfile.totalIncome -= amount;
    totalIncomeP.innerText = userProfile.budget + " €";
    chart.data.datasets[0].data[1] -= amount;
    chart.update();
  }
};

const addExpense = (amount) => {
  subtractBudget(amount);
};

const setIncomeButtonActive = () => {
  btnSelectExpense.classList.remove("bg-red");
  btnSelectIncome.classList.add("bg-green");
};

const setExpenseButtonActive = () => {
  btnSelectExpense.classList.add("bg-red");
  btnSelectIncome.classList.remove("bg-green");
};

const getTransactionObject = () => {
  return {
    id: userProfile.totalTransactions,
    amount: Number(inputAmount.value),
    description: inputDescription.value,
    date: inputDate.value,
    category: inputCategory.value,
    type:
      transactionType === TransactionType.INCOME
        ? TransactionType.INCOME
        : TransactionType.EXPENSE,
  };
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

const addTransactionToTransactionList = (transactionObject) => {
  const categoryImgURL = globalSettings.defaultCategories.find(
    (defaultCategory) => {
      return defaultCategory.category == transactionObject.category;
    }
  ).img;

  const newRow = `
    <tr data-transaction-id=${transactionObject.id}>
    <td>
    <span class="img-cel">
    <img src=${categoryImgURL} alt="" />
    <span>${transactionObject.category}</span>
    </span>
    </td>
    <td>${transactionObject.description}</td>
    <td>${transactionObject.date}</td>
    <td>${transactionObject.amount} €</td>
    <td>
    ${transactionObject.type}
    <div class="${transactionObject.type}-color-tag"></div>
    </td>
    </tr>
    `;

  transactionList.innerHTML += newRow;
};

const clearTransactionList = () => {
  transactionList.innerHTML = "";
};

const renderTransactionList = () => {
  clearTransactionList();
  userProfile.transactions
    .slice()
    .reverse()
    .forEach((transaction) => {
      addTransactionToTransactionList(transaction);
    });
};

////////////////////////////
// SELECT CATEGORY LOGIC //
//////////////////////////
const addCategories = () => {
  globalSettings.defaultCategories.forEach((category) => {
    categoryModal.innerHTML += `
      <div class="category-item" data-category=${category.category} data-category-img=${category.img}>
      <img src=${category.img} alt="" />
      <p>${category.category}</p>
      </div>
      `;
  });

  document.querySelectorAll(".category-item").forEach((element) => {
    element.addEventListener("click", (e) => {
      const category = e.target.parentNode.dataset.category;
      const imgUrl = e.target.parentNode.dataset.categoryImg;
      onCategorySelected(category, imgUrl);
    });
  });
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
