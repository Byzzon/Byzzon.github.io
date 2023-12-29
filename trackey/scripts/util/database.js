import {
  addTransactionToTransactionList,
  renderTransactionList,
} from "../index.mjs";
import { updateChartLabels } from "../index.mjs";
import { refreshChart } from "../my-graphs.js";
import Transaction from "./Transaction.js";

const dbName = "TrackeyDB";
let db;

const request = indexedDB.open(dbName, 2);

request.onerror = (event) => {
  // Handle errors.
};

request.onupgradeneeded = (event) => {
  db = event.target.result;

  const objectStore = db.createObjectStore("transactions", { keyPath: "id" });

  objectStore.createIndex("id", "id", { unique: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
  initializeUserProfile();
};

export const addTransactionToDB = (transactionObject) => {
  const transaction = db.transaction(["transactions"], "readwrite");

  // Do something when all the data is added to the database.
  transaction.oncomplete = (event) => {
    console.log("All done!");
  };

  transaction.onerror = (event) => {
    // Don't forget to handle errors!
    console.error(event.target.error);
  };

  const objectStore = transaction.objectStore("transactions");

  const request = objectStore.add(transactionObject);

  request.onsuccess = (event) => {
    console.log("Transaction added.");
  };
};

export const clearDatabase = (objectStoreName) => {
  const transaction = db.transaction([objectStoreName], "readwrite");

  transaction.oncomplete = (event) => {};

  transaction.onerror = (event) => {
    console.error(event.target.error);
  };

  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.clear();

  request.onsuccess = (event) => {
    console.log("Database cleared.");
  };

  request.onerror = (event) => {
    console.log("Could not clear the database.");
  };
};

export const getAllTransactions = () => {
  return db.transaction("transactions").objectStore("transactions").getAll();
};

const initializeUserProfile = () => {
  getAllTransactions().onsuccess = (event) => {
    const transactions = event.target.result;

    userProfile.totalTransactions = transactions.length;

    transactions.forEach((transaction) => {
      userProfile.transactions.push(transaction);

      if (transaction.type === Transaction.TransactionType.INCOME) {
        userProfile.totalIncome += transaction.amount;
      } else {
        userProfile.totalExpenses += transaction.amount;
      }
    });

    userProfile.budget = userProfile.totalIncome - userProfile.totalExpenses;

    renderTransactionList();
    refreshChart();
    updateChartLabels();
  };
};
