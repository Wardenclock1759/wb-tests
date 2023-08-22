import "../pages/index.css";

import Section from "../components/Section";
import Card from "../components/Card";
const data = require('../data.json');

const cards = [];

const cardSection = new Section(
    (item, template) => {
      const cardElement = createCard(item, template);
      cardSection.addItem(cardElement);
    }, ".card__list_items"
);

const absentSection = new Section(
    (item, template) => {
      const cardElement = createCard(item, template);
      absentSection.addItem(cardElement);
    }, ".card__list_absent"
);

function createCard(cardData, template) {
    const card = new Card(
      cardData,
      template,
    );
    const newCard = card.generateCard();
    cards.push(card);
    return newCard;
}

let isDefaultScreen = screen.width > 720;
let cardTemplate = "#card-template-default";

if (!isDefaultScreen) {
    cardTemplate = "#card-template-small";
}

cardSection.renderItems(data, cardTemplate);
absentSection.renderItems(data, cardTemplate);

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
})

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