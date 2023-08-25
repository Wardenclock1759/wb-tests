import "../pages/index.css";

import Section from "../components/Section";
import Card from "../components/Card";
const data = require('../data.json');

const cards = [];

function prettify(number) {
  if (number < 1000) {
    return number;
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
}

function initiateTotal() {
  let totalNew = 0;
  let totalOld = 0;
  let itemCount = 0;
  cards.forEach((card) => {
    const price = card.getTotal();
    totalNew += price.newTotal;
    totalOld += price.oldTotal;
    itemCount += price.itemTotal;
  });
  const currency = document.createElement('span');
  currency.classList.add('total__title_currency');
  currency.textContent = ' сом';
  
  const newValue = document.querySelector('#total__new__value');
  newValue.innerHTML = '';
  newValue.textContent = prettify(totalNew);
  newValue.append(currency);

  document.querySelector('#total__item__value').textContent = `${itemCount} товара`;
  document.querySelector('#total__old__value').textContent = `${prettify(totalOld)} сом`;
  document.querySelector('#total__discount__value').textContent = `−${prettify(totalOld - totalNew)} сом`;
}

const cardSection = new Section(
  (item, template) => {
    const cardElement = createCard(item, template);
    cardSection.addItem(cardElement);
  }, ".card__list_items"
);

const absentSection = new Section(
  (item, template) => {
    const cardElement = createCard(item, template, false);
    absentSection.addItem(cardElement);
  }, ".card__list_absent"
);

function createCard(cardData, template, absent = true) {
  const card = new Card(
    cardData,
    template,
    initiateTotal
  );
  const newCard = card.generateCard();
  if (absent) cards.push(card);
  return newCard;
}

let isDefaultScreen = screen.width > 720;
let cardTemplate = isDefaultScreen ? "#card-template-default" : "#card-template-small";

cardSection.renderItems(data, cardTemplate);
absentSection.renderItems(data, cardTemplate);

const firstRowDelivery = document.querySelector('#panel__content__date_primary');
const secondRowDelivery = document.querySelector('#panel__content__date_secondary');

function initDelivery() {
  const limit = 184;
  let itemCount = 0;
  cards.forEach((card) => {
    const count = card._counterValue;
    itemCount += count;

    const container = document.createElement('div');
    container.classList.add('floater__container');
    const floater = document.createElement('div');
    floater.classList.add('floater');
    const img = document.createElement('img');
    img.classList.add('panel__image');
    img.src = card._image;
    img.alt = "Изображение: " + card._title;
    container.append(img);

    if (count <= 1) {
      firstRowDelivery.append(container);
    } else if (count <= limit) {
      floater.textContent = count;
      container.append(floater);
      firstRowDelivery.append(container);
    } else {
      const secondRowCount = count - limit;

      floater.textContent = limit;
      container.append(floater);
      firstRowDelivery.append(container);

      const secondRowContainer = document.createElement('div');
      secondRowContainer.classList.add('floater__container');

      const secondRowFloater = document.createElement('div');
      secondRowFloater.classList.add('floater');
      secondRowFloater.textContent = secondRowCount;
      secondRowContainer.append(secondRowFloater);

      const img = document.createElement('img');
      img.classList.add('panel__image');
      img.src = card._image;
      img.alt = "Изображение: " + card._title;
      secondRowContainer.append(img);
      secondRowDelivery.append(secondRowContainer);
    }
  });

    const cartButton = document.querySelector('#header__cartButton');
    const cartButtonSmall = document.querySelector('#tabbar__cartButton');
    let floater = document.createElement('div');
    floater.classList.add('floater');
    floater.classList.add('floater_cart');
    floater.textContent = itemCount;
    cartButton.append(floater);
    floater = document.createElement('div');
    floater.classList.add('floater');
    floater.classList.add('floater_cart_small');
    floater.textContent = itemCount;
    cartButtonSmall.append(floater);
}

function initForm() {
  const formInputs = document.querySelectorAll('.form__input-wrapper');
  formInputs.forEach((formInput) => {
    const input = formInput.querySelector('.form__input');
    const label = formInput.querySelector('.form__label');

    if (input.value !== '') {
      label.classList.remove('form__label_hidden');
    }
    
    input.addEventListener('blur', () => {
      if (input.value === '') {
        label.classList.add('form__label_hidden');
      }
    });
    input.addEventListener('input', () => {
      if (input.value !== '') {
        label.classList.remove('form__label_hidden');
      } else {
        label.classList.add('form__label_hidden');
      }
    })
  });
}

const cartButton = document.querySelector('#cart__button');
const itemContainer = document.querySelector('.card__list_items');
const itemContainerHeight = itemContainer.clientHeight;
itemContainer.style.height = `${itemContainerHeight}px`;

const absentButton = document.querySelector('#absent__button');
const absentContainer = document.querySelector('.card__list_absent');
const absentContainerHeight = absentContainer.clientHeight;
absentContainer.style.height = `${absentContainerHeight}px`;

cartButton.addEventListener('click', () => {
  if (itemContainer.classList.contains('card__list_opened')) {
    itemContainer.classList.remove('card__list_opened');
    cartButton.classList.add('cart__button_opened');
    itemContainer.style.height = 0;
    return;
  }
  itemContainer.classList.add('card__list_opened');
  cartButton.classList.remove('cart__button_opened');
  itemContainer.style.height = `${itemContainerHeight}px`;
});

absentButton.addEventListener('click', () => {
  if (absentContainer.classList.contains('card__list_opened')) {
    absentContainer.classList.remove('card__list_opened');
    absentButton.classList.add('cart__button_opened');
    absentContainer.style.height = 0;
    return;
  }
  absentContainer.classList.add('card__list_opened');
  absentButton.classList.remove('cart__button_opened');
  absentContainer.style.height = `${absentContainerHeight}px`;
});

const newPrice = document.querySelectorAll('.card__price-new');
newPrice.forEach(priceContainer => {
  const priceWidth = priceContainer.clientWidth;
  if (priceWidth >= 80) {
    priceContainer.classList.add('card__price-new_small');
  }
});

const cartCheckbox = document.querySelector('.cart__checkbox');
const checkboxUnchecked = document.querySelector('#cart__checkbox_unchecked');
const checkboxChecked = document.querySelector('#cart__checkbox_checked');

cartCheckbox.addEventListener('click', () => {
  if (checkboxChecked.classList.contains('cart__checkbox_unchecked')) {
    checkboxChecked.classList.remove('cart__checkbox_unchecked');
    checkboxUnchecked.classList.add('cart__checkbox_unchecked');

    cards.forEach(item => {
      item.setUnchecked();
    });

    return;
  } else {
    checkboxChecked.classList.add('cart__checkbox_unchecked');
    checkboxUnchecked.classList.remove('cart__checkbox_unchecked');

    cards.forEach(item => {
      item.setChecked();
    });
  }
});

initDelivery();
initForm();
initiateTotal();