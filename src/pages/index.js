import "../pages/index.css";

import Section from "../components/Section";
import Card from "../components/Card";
const data = require('../data.json');

const cards = [];

const cardSection = new Section(
    (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    }, ".card__list"
);

function createCard(cardData) {
    const card = new Card(
      cardData,
      "#card-template",
    );
    const newCard = card.generateCard();
    cards.push(card);
    return newCard;
}

data.map(card => {
    createCard(card);
})

cardSection.renderItems(data);

const button = document.querySelector('.cart__button');
const container = document.querySelector('.card__list');
const containerHeight = container.clientHeight;
container.style.height = `${containerHeight}px`;

button.addEventListener('click', () => {
    if (container.classList.contains('card__list_opened')) {
        container.classList.remove('card__list_opened');
        button.classList.add('cart__button_opened');
        container.style.height = 0;
        return;
    }
    container.classList.add('card__list_opened');
    button.classList.remove('cart__button_opened');
    container.style.height = `${containerHeight}px`;    
});

const newPrice = document.querySelectorAll('.card__price-new');
newPrice.forEach(priceContainer => {
    const priceWidth = priceContainer.clientWidth;
    if (priceWidth >= 40) {
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