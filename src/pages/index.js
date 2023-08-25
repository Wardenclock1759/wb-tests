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
    const cardElement = createCard(item, template, false);
    absentSection.addItem(cardElement);
  }, ".card__list_absent"
);

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

const inputStates = {};
for (const input of document.querySelectorAll('.form__input')) {
  inputStates[input.id] = {
    valid: false
  };
}

const config = {
  mail: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
  phone: '\\+7\\d{10}',
  number: '^\\d{14}$',
};

const messagesContent = {
  mail: 'Проверьте адрес электронной почты',
  phone: 'Формат: +9 999 999 99 99',
  number: 'Проверьте ИНН',
};

const messagesRequired = {
  name: 'Укажите имя',
  surname: 'Введите фамилию',
  mail: 'Укажите электронную почту',
  phone: 'Укажите номер телефона',
  number: 'Укажите ИНН',
};

function initForm() {

  function getValidationString(id) {
    return config[id];
  }

  const formInputs = document.querySelectorAll('.form__input-wrapper');
  formInputs.forEach((formInput) => {
    const input = formInput.querySelector('.form__input');
    const label = formInput.querySelector('.form__label');
    const validationString = getValidationString(input.id);

    if (input.value !== '') {
      label.classList.remove('form__label_hidden');
    }

    if (input.id === 'phone') {
      input.addEventListener('keydown', (event) => {
        const isLetterKey = event.keyCode >= 65 && event.keyCode <= 90;
      
        if (isLetterKey) {
          event.preventDefault();
        }
      });
    }    
    
    input.addEventListener('blur', () => {
      const errorField = formInput.querySelector(`#${input.id}_error`);
      if (input.value === '') {
        label.classList.add('form__label_hidden');
      } else {
        if (validationString) {
          const regex = new RegExp(validationString);
          if (!regex.test(input.value)) {
            errorField.textContent = messagesContent[input.id];
            errorField.classList.remove('form__error_hidden');
            errorField.classList.add('form__error_active');
            formInput.querySelector('.form__line').classList.add('form__line_active');
            input.classList.add('form__input_active');
            inputStates[input.id].valid = false;
          }
        } else {
          errorField.classList.add('form__error_hidden');
          errorField.classList.remove('form__error_active');
          formInput.querySelector('.form__line').classList.remove('form__line_active');
          input.classList.remove('form__input_active');
          inputStates[input.id].valid = true;
        }
      }      
    });

    input.addEventListener('input', () => {
      if (input.value !== '') {
        label.classList.remove('form__label_hidden');
      } else {
        label.classList.add('form__label_hidden');
      }

      if (validationString && !inputStates[input.id].valid) {
        const regex = new RegExp(validationString);
        if (regex.test(input.value) || input.value === '') {
          const errorField = formInput.querySelector(`#${input.id}_error`);
          errorField.classList.add('form__error_hidden');
          errorField.classList.remove('form__error_active');
          formInput.querySelector('.form__line').classList.remove('form__line_active');
          input.classList.remove('form__input_active');
          inputStates[input.id].valid = true;

          if (input.id === 'number') {
            errorField.classList.remove('form__error_hidden');
            errorField.textContent = 'Для таможенного оформления';
          }
        }
      }

      if (!validationString) {
        if (input.value === '') inputStates[input.id].valid = false;
        else {
          inputStates[input.id].valid = true;
          const errorField = formInput.querySelector(`#${input.id}_error`);
          errorField.classList.add('form__error_hidden');
          errorField.classList.remove('form__error_active');
          formInput.querySelector('.form__line').classList.remove('form__line_active');
          input.classList.remove('form__input_active');
        }
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

function checkForm() {
  const formInputs = document.querySelectorAll('.form__input-wrapper');
  let formIsValid = 0;
  formInputs.forEach((formInput) => {
    const input = formInput.querySelector('.form__input');
    const isValid = inputStates[input.id].valid;
    formIsValid += !isValid;
    if (!isValid) {
      if (input.value === '') {
        const errorField = formInput.querySelector(`#${input.id}_error`);
        errorField.textContent = messagesRequired[input.id];
        errorField.classList.remove('form__error_hidden');
        errorField.classList.add('form__error_active');
        formInput.querySelector('.form__line').classList.add('form__line_active');
        input.classList.add('form__input_active');
      }
    }
  });
  if (formIsValid === 0) {
    console.log('Отправка формы');
  }
}
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', checkForm);

function closeDeliveryPopup() {
  const deliveryPopup = document.querySelector('#delivery__popup');
  deliveryPopup.classList.remove('popup_opened');
}

const deliverySubmitButton = document.querySelector('#delivery__submit');
const deliveryCloseButton = document.querySelector('#delivery__close');
deliveryCloseButton.addEventListener('click', closeDeliveryPopup);
deliverySubmitButton.addEventListener('click', () => {
  deliveryPopupSubmit();
  closeDeliveryPopup();
});

const deliveryTabButton1 = document.querySelector('#delivery_tab1');
const deliveryTabButton2 = document.querySelector('#delivery_tab2');
const deliveryTab1 = document.querySelector('#deliveryTab1');
const deliveryTab2 = document.querySelector('#deliveryTab2');

deliveryTabButton1.addEventListener('click', () => {
  if (!deliveryTabButton1.classList.contains('popup__tab-btn_active')) {
    deliveryTabButton1.classList.add('popup__tab-btn_active');
    deliveryTabButton2.classList.remove('popup__tab-btn_active');
    
    deliveryTab1.classList.add('popup__tab-content_active');
    deliveryTab2.classList.remove('popup__tab-content_active');
  }
});

deliveryTabButton2.addEventListener('click', () => {
  if (!deliveryTabButton2.classList.contains('popup__tab-btn_active')) {
    deliveryTabButton2.classList.add('popup__tab-btn_active');
    deliveryTabButton1.classList.remove('popup__tab-btn_active');
    
    deliveryTab2.classList.add('popup__tab-content_active');
    deliveryTab1.classList.remove('popup__tab-content_active');
  }
});

const deliveryPopupOpenPanel = document.querySelector('#panel__delivery__popup');
const deliveryPopupOpenTotal = document.querySelector('#total__delivery__popup');

function openDeliveryPopup() {
  const deliveryPopup = document.querySelector('#delivery__popup');
  deliveryPopup.classList.add('popup_opened');
}

const tabs = document.querySelector('#delivery__popup').querySelectorAll('.popup__tab-content');

tabs.forEach((tab) => {
  const buttons = tab.querySelectorAll('.popup__checkbox');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (button.classList.contains('popup__checkbox_checked')) return;
      buttons.forEach(button => {
        button.classList.remove('popup__checkbox_checked');
        
        const svgs = button.querySelectorAll('.popup__svg');
        svgs[0].classList.remove('popup__svg_active');
        svgs[1].classList.add('popup__svg_active');
      });
      button.classList.add('popup__checkbox_checked');
      const svgs = button.querySelectorAll('.popup__svg');
      svgs[0].classList.add('popup__svg_active');
      svgs[1].classList.remove('popup__svg_active');
    });
  }
});

function deliveryPopupSubmit() {
  const activeTab = document.querySelector('#delivery__popup').querySelector('.popup__tab-content_active');
  let value = {};

  const items = activeTab.querySelectorAll('.popup__item');
  items.forEach((item) => {
    const checkbox = item.querySelector('.popup__checkbox');
    if (checkbox.classList.contains('popup__checkbox_checked')) {
      value = item;
    }
  });

  if (value.classList.contains('popup__item_adress')) {
    parseAdress(value);
  } else {
    parseStore(value);
  }
}

function parseAdress(object) {
  const adress = object.querySelector('.popup__text').textContent;
  const deliveryTextContainer = document.querySelector('.panel__content');
  deliveryTextContainer.innerHTML = '';
  const newAdress = document.createElement('span');
  newAdress.textContent = adress;
  newAdress.classList.add('panel__content');
  deliveryTextContainer.append(newAdress);
}

function parseStore(object) {
  const adress = object.querySelector('.popup__text').textContent;
  const raiting = object.querySelector('.panel__subtext').textContent;

  const shop = document.querySelector('#shop-template').content.querySelector('.shop').cloneNode(true);
  const deliveryTextContainer = document.querySelector('.panel__content');
  deliveryTextContainer.innerHTML = '';
  console.log(shop)
  const addressContainer = shop.querySelector('.panel__point');
  const raitingContainer = shop.querySelector('.panel__subtext');
  addressContainer.textContent = adress;
  raitingContainer.textContent = raiting;

  deliveryTextContainer.append(shop);
}

deliveryPopupOpenPanel.addEventListener('click', openDeliveryPopup);
deliveryPopupOpenTotal.addEventListener('click', openDeliveryPopup);

initDelivery();
initForm();
initiateTotal();