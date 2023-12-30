const globalSettings = {
  defaultCategories: [
    {
      category: "Food",
      img: "./images/icons/restaurant.svg",
    },
    {
      category: "Health",
      img: "./images/icons/health_metrics.svg",
    },
    {
      category: "Gift",
      img: "./images/icons/gift.svg",
    },
    {
      category: "Paycheck",
      img: "./images/icons/business_center.svg",
    },
  ],
  customCategories: [],
};

const devtools = {
  show: function () {
    document.querySelector(".devtools").classList.remove("display-none");
  },
  hide: function () {
    document.querySelector(".devtools").classList.add("display-none");
  },
};
