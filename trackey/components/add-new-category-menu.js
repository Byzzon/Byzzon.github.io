import {
  hideSelectCategory,
  modalTitle,
  Menu,
  Modal,
} from "./add-transaction-modal.js";

const newCategoryIconList = document.getElementById("new-category-icon-list");
const addNewCategoryMenu = document.getElementById("add-new-category-menu");

export const showAddNewCategoryMenu = () => {
  hideSelectCategory();
  modalTitle.innerText = "Add New Category";
  addNewCategoryMenu.style.display = "flex";
  Modal.currentMenu = Menu.ADD_NEW_CATEGORY;
};

export const hideAddNewCategoryMenu = () => {
  addNewCategoryMenu.style.display = "none";
};

const renderCategoryIcons = () => {
  globalSettings.defaultCategories.forEach((defaultCategory) => {
    newCategoryIconList.innerHTML += `
    <div class="category-item hoverable">
      <img src="${defaultCategory.img}" alt="" />
    </div>
    `;
  });
};

renderCategoryIcons();
