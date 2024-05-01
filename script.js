const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("income");
const moneyMinus = document.getElementById("expenses");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const budgetForm = document.getElementById("form-budget");
const budgetInput = document.getElementById("budget");
const weekNum = document.getElementById("week-number");
const setBudgetContainer = document.getElementById("set-budget");
const trackerContainer = document.getElementById("tracker-container");

// Function to check if the stored budget is expired
const isBudgetExpired = () => {
  const storedDate = localStorage.getItem("budgetSetDate");
  if (!storedDate) return true; // If no date is stored, consider it expired
  const setWeek = new Date(storedDate).getWeek();
  const currentWeek = new Date().getWeek();
  return setWeek !== currentWeek; // Check if stored week is different from current week
};

// Function to set the weekly budget and store the current date
const setWeeklyBudget = (budget) => {
  localStorage.setItem("weeklyBudget", budget);
  localStorage.setItem("budgetSetDate", new Date().toISOString());
};

// Function to get the weekly budget from localStorage
const getWeeklyBudget = () => {
  // Check if stored budget is expired, if yes, reset budget and date
  if (isBudgetExpired()) {
    localStorage.removeItem("weeklyBudget");
    localStorage.removeItem("budgetSetDate");
    return 0; // Return 0 as budget is expired
  }
  const budget = localStorage.getItem("weeklyBudget");
  return budget ? parseFloat(budget) : 0;
};

// Function to check if expenses exceed the weekly budget and display alert if necessary
const checkExpensesAgainstBudget = () => {
  const weeklyBudget = getWeeklyBudget();

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  // Compare total expenses with weekly budget
  if (Math.abs(totalExpenses) > weeklyBudget) {
    alert("Expenses have exceeded the weekly budget!");
  }
};

// Event listener to handle budget submission
budgetForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission behavior
  const budget = parseFloat(budgetInput.value);
  // Set the weekly budget and store it in localStorage
  setWeeklyBudget(budget);
  // Clear the budget input field
  budgetInput.value = "";
  // Hide the setBudgetContainer
  setBudgetContainer.hidden = true;
  // Show the trackerContainer
  trackerContainer.hidden = false;
  // Display confirmation message
  alert("Weekly budget has been set successfully!");
});

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

const date = new Date();
weekNum.textContent = date.getWeek();

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction to DOM
const addTransactionsDOM = (transaction) => {
  // Get sign whether it is minus or plus
  const sign = transaction.amount < 0 ? "-" : "+";
  //   Create list items dynamically
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `${transaction.item} <span>${sign}${Math.abs(
    transaction.amount
  ).toFixed(2)}</span><button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;
  list.appendChild(item);
};

// Update total balance, income and expense
const updateExpensesDOM = () => {
  // get total amount
  const amount = transactions.map((transaction) => transaction.amount);
  // add up total
  const total = amount.reduce((acc, item) => (acc += item), 0).toFixed(2);
  // filter only income
  const income = amount
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  // filter only expenses
  const expenses = amount
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  //   render balance
  balance.textContent =
    total < 0 ? `-£${Math.abs(total).toFixed(2)}` : `£${total}`;
  moneyPlus.textContent = `+£${Math.abs(income).toFixed(2)}`;
  moneyMinus.textContent = `-£${Math.abs(expenses).toFixed(2)}`;

  // apply class based on balance
  balance.classList.toggle("minus", Math.sign(total) === -1);
  balance.classList.toggle("plus", Math.sign(total) === 1);
};

const addTransaction = (e) => {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please input a value");
  } else {
    const transaction = {
      id: genRandID(),
      item: text.value,
      amount: +amount.value,
    };
    console.log(transaction);
    transactions.push(transaction);
    addTransactionsDOM(transaction);
    updateExpensesDOM();
    updateLocalStorage();
    checkExpensesAgainstBudget();
    text.value = "";
    amount.value = "";
  }
};

// Generate random ID
const genRandID = () => {
  return Math.floor(Math.random() * 100000000);
};

// remove transaction by ID
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  initApp();
};

// Update local storage transactions
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Initialise app
const initApp = () => {
  list.innerHTML = "";
  transactions.forEach(addTransactionsDOM);
  updateExpensesDOM();
  if (getWeeklyBudget() > 0) {
    trackerContainer.hidden = false;
    setBudgetContainer.hidden = true;
  } else {
    trackerContainer.hidden = true;
    setBudgetContainer.hidden = false;
  }
};

form.addEventListener("submit", addTransaction);

// Initialize the app
initApp();
