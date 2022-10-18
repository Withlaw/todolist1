"use strict";

const form = document.querySelector(".form");
const inputTodo = document.querySelector(".todo");
const btnSubmit = document.querySelector(".btn__submit");
const items = document.querySelector(".items");
const btnCircle = document.querySelector(".btn--circle__box");
const btnClear = document.querySelector(".btn__clear");
const btnDelete = document.querySelector(".item--delete--icon");
const loader = document.querySelector(".loader--container");
const empty = document.querySelector(".empty");

class List {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  check = false;
  constructor(content) {
    this.content = content;
  }
}

class App {
  #list = [];
  #selectAll = false;

  constructor() {
    this._getListfromLocalStorage();
    this._btnCheck();
    this._btnDelete();
    form.addEventListener("submit", this._newList.bind(this));
    btnCircle.addEventListener("click", this._selectAll.bind(this));
    btnClear.addEventListener("click", this._clear);
    window.addEventListener("load", () => {
      loader.classList.add("hidden");
    });
  }
  _newList(e) {
    e.preventDefault();
    empty.classList.add("hidden");

    const list = new List(inputTodo.value);
    this.#list.push(list);
    this._renderList(list);

    this._setListToLocalstorage();
    // location.reload();
    inputTodo.value = "";
    inputTodo.focus();

    this._btnCheck();
    this._btnDelete();
  }
  _getListfromLocalStorage() {
    inputTodo.focus();

    const data = localStorage.getItem("todoList");
    if (data?.length > 2) empty.classList.add("hidden");
    if (!data) return;
    this.#list = JSON.parse(data);
    this.#list.forEach((el) => this._renderList(el));
  }
  _setListToLocalstorage() {
    localStorage.setItem("todoList", JSON.stringify(this.#list));
  }
  _renderList(list) {
    let html = `
      <li class="item" data-id="${list.id}">
        <div class="item--circle__box">
          <div class="item--circle"></div>
          <div class="item--circle checked ${list.check ? "" : "hidden"}"></div>
        </div>
        <div class="item--container">
          <h2 class="item__title ${list.check ? "lined" : ""}">${
      list.content
    }</h2>
        </div>
        <div class="item--delete">
          <span class="item--delete--icon">
            <i class="fas fa-backspace"></i>
          </span>
        </div>
      </li>
    `;
    items.insertAdjacentHTML("afterbegin", html);
  }
  _btnCheck() {
    document.querySelectorAll(".item--circle__box").forEach((btn) => {
      btn.addEventListener("click", this._check.bind(this));
    });
  }
  _check(e) {
    const LiEl = e.target.closest(".item");
    const circleEl = LiEl.querySelector(".checked");
    const textEl = LiEl.querySelector(".item__title");

    circleEl.classList.toggle("hidden");
    textEl.classList.toggle("lined");

    // check -> true
    const listEl = this.#list.filter((list) => list.id === LiEl.dataset.id)[0];
    listEl.check = !listEl.check;
    this._setListToLocalstorage();
  }
  _btnDelete() {
    document
      .querySelectorAll(".item--delete--icon")
      .forEach((el) => el.addEventListener("click", this._delete.bind(this)));
  }
  _delete(e) {
    const deleteItem = e.target.closest(".item");
    this.#list = this.#list.filter((el) => el.id !== deleteItem.dataset.id);
    this._setListToLocalstorage();
    location.reload();
  }
  _clear() {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;
    localStorage.setItem("todoList", []);
    location.reload();
  }
  _selectAll(e) {
    if (this.#list.length === 0) return;

    this.#selectAll = !this.#selectAll;
    const btnCircleBox = e.target.closest(".btn--circle__box");
    btnCircleBox
      .querySelector(".btn--circle--check")
      .classList.toggle("hidden");
    if (this.#selectAll) {
      document
        .querySelectorAll(".checked")
        .forEach((el) => el.classList.remove("hidden"));
      document
        .querySelectorAll(".item__title")
        .forEach((el) => el.classList.add("lined"));
      this.#list.forEach((el) => {
        el.check = true;
      });
    } else {
      document
        .querySelectorAll(".checked")
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll(".item__title")
        .forEach((el) => el.classList.remove("lined"));
      this.#list.forEach((el) => {
        el.check = false;
      });
    }

    this._setListToLocalstorage();
  }
}

const app = new App();
