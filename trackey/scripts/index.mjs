const addNewTransactionBtn = document.getElementById("new-transaction-btn");

// When the user clicks the button, open the modal
addNewTransactionBtn.addEventListener("click", () => {
  modal.style.display = "block";
  displayAddTransaction();
});
