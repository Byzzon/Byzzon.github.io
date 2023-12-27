const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalSelectExpense = document.getElementById("modal-select-expense");
const modalSelectIncome = document.getElementById("modal-select-income");
const modalBody = document.getElementById("modal-body");
const transactionDescriptionInput = document.getElementById(
  "transaction-description"
);
const categoryImg = document.getElementById("category-img");
const categoryInput = document.getElementById("category-input");
const addTransactionBtn = document.getElementById("add-transaction-btn");
const amountInput = document.getElementById("amount-input");
const totalIncomeP = document.getElementById("total-income");
const totalExpensesP = document.getElementById("total-expenses");
const categoryModal = document.querySelector(".category-modal");

const TransactionType = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
});
let transactionType = TransactionType.INCOME;

// Event Listeners
// When the user clicks on <span> (x), close the modal
span.addEventListener("click", () => {
  closeModal();
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

modalSelectIncome.addEventListener("click", (e) => {
  setIncomeButtonActive();
  transactionType = TransactionType.INCOME;
});

modalSelectExpense.addEventListener("click", (e) => {
  setExpenseButtonActive();
  transactionType = TransactionType.EXPENSE;
});

categoryInput.addEventListener("click", () => {
  displaySelectCategory();
});

addTransactionBtn.addEventListener("click", () => {
  const transaction = {};
  transaction.amount = Number(amountInput.value);

  if (transaction.amount <= 0) {
    return;
  }

  if (transactionType === TransactionType.INCOME) {
    addIncome(transaction.amount);
    closeModal();
  }

  if (transactionType === TransactionType.EXPENSE) {
    addExpense(transaction.amount);
    closeModal();
  }

  userProfile.transactions.push(getTransactionObject());
});

// Methods
const displaySelectCategory = () => {
  modalBody.style.display = "none";
  modalTitle.innerText = "Select Category";
  categoryModal.style.display = "grid";
};

const hideSelectCategory = () => {
  categoryModal.style.display = "none";
};

const displayAddTransaction = () => {
  hideSelectCategory();
  modalBody.style.display = "flex";
  modalTitle.innerText = "Add Transaction";
};

const closeModal = () => {
  modal.style.display = "none";
};

const addIncome = (amount) => {
  chart.data.datasets[0].data[1] += amount;
  userProfile.totalIncome += amount;
  totalIncomeP.innerText = userProfile.totalIncome + " €";
  chart.update();
};

const addExpense = (amount) => {
  chart.data.datasets[0].data[0] += amount;
  userProfile.totalExpenses += amount;
  totalExpensesP.innerText = userProfile.totalExpenses + " €";
  chart.update();
};

const setIncomeButtonActive = () => {
  modalSelectExpense.classList.remove("bg-red");
  modalSelectIncome.classList.add("bg-green");
};

const setExpenseButtonActive = () => {
  modalSelectExpense.classList.add("bg-red");
  modalSelectIncome.classList.remove("bg-green");
};

const getTransactionObject = () => {
  return {
    amount: Number(amountInput.value),
    description: transactionDescriptionInput.value,
    category: categoryInput.value,
    type:
      transactionType === TransactionType.INCOME
        ? TransactionType.INCOME
        : TransactionType.EXPENSE,
  };
};

const setCategoryInput = (category) => {
  categoryInput.value = category;
};

const setCategoryImg = (imgURL) => {
  categoryImg.src = imgURL;
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
  displayAddTransaction();
};

setIncomeButtonActive();
addCategories();
