export default class Card {
    constructor(cardData, templateSelector) {
        this._title = cardData.title;
        this._options = cardData.options;
        this._seller = cardData.seller;
        this._company = cardData.company;
        this._inStock = cardData.inStock;
        this._counterValue = cardData.initial;

        const [number, currency] = this._splitString(cardData.newPrice);
        this._newPrice = number;
        this._currency = currency;
        this._oldPrice = cardData.oldPrice;
        
        this._image = cardData.src;
        this._templateSelector = templateSelector;
    }

    _getTemplate() {
        const cardTemplate = document.querySelector(this._templateSelector).content.querySelector('.card').cloneNode(true);
        return cardTemplate;
    }

    _prettify(number) {
        if (number < 1000) {
          return number;
        } else {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
    }

    _formatOldPrice(string = '', multiplier = 1) {
        const [number, currency] = this._splitString(string);
        const formattedNumber = this._prettify(number * multiplier);
        return `${formattedNumber} ${currency}`;
    }

    _splitString(string) {
        const currencyIndex = string.indexOf(" ");
        const number = string.slice(0, currencyIndex);
        const currency = string.slice(currencyIndex + 1);
        return [number, currency];
    }

    _decreaseCounter() {
        this._counterValue--;
        this._card.querySelector('.card__number').textContent = this._counterValue;
        this._increaseButton.disabled = false;
    
        if (this._counterValue === 1) {
            this._decreaseButton.disabled = true;
        }

        this._initiateTotal();
    }
    
    _increaseCounter() {
        this._counterValue++;
        this._card.querySelector('.card__number').textContent = this._counterValue;
        this._decreaseButton.disabled = false;

        if (this._counterValue === this._inStock - 1) {
        } else if (this._counterValue === this._inStock) {
            this._increaseButton.disabled = true;
        }

        this._initiateTotal();
    }

    _initiateCounter() {
        if (this._counterValue === 1) {
            this._decreaseButton.disabled = true;
        }
        if (this._counterValue === this._inStock) {
            this._increaseButton.disabled = true;
        }
    }

    _initiateTotal() {
        this._newPriceContainer.textContent = this._prettify(this._counterValue * this._newPrice);
        this._oldPriceContainer.textContent = this._formatOldPrice(this._oldPrice, this._counterValue);
    }

    generateCard() {
        this._card = this._getTemplate();
        this._checkbox = this._card.querySelector('.card__checkbox');
        this._cardImage = this._card.querySelector('.card__image');
        this._warningContainer = this._card.querySelector('.card__warning-wrapper');
        const optionContainer = this._card.querySelector('.card__option-wrapper');

        this._decreaseButton = this._card.querySelector('.card__button_order_dec');
        this._increaseButton = this._card.querySelector('.card__button_order_inc');
        this._newPriceContainer = this._card.querySelector('.card__price-new');
        this._oldPriceContainer = this._card.querySelector('.card__price-old');

        this._infoTooltip = this._card.querySelector('.card__tooltip_company');
        if (this._infoTooltip) {
            const name = document.createElement('h2');
            name.classList.add('card__tooltip__title');
            name.textContent = this._company.name;
            this._infoTooltip.append(name);

            const ogrn = document.createElement('span');
            ogrn.classList.add('card__tooltip__text');
            ogrn.textContent = `ОГРН: ${this._company.ogrn}`;
            this._infoTooltip.append(ogrn);

            const address = document.createElement('span');
            address.classList.add('card__tooltip__text');
            address.textContent = this._company.address;
            this._infoTooltip.append(address);
        }

        this._priceTooltip = this._card.querySelector('.card__tooltip_price');
        if (this._priceTooltip) {
            let row = document.createElement('div');
            row.classList.add('card__tooltip__row');

            let totalDiscount = document.createElement('span');
            totalDiscount.classList.add('card__tooltip__text');
            totalDiscount.classList.add('card__tooltip__text_grey');
            totalDiscount.textContent = 'Скидка 55%';
            row.append(totalDiscount);

            let totalDiscountValue = document.createElement('span');
            totalDiscountValue.classList.add('card__tooltip__text');
            totalDiscountValue.textContent = '−300 сом';
            row.append(totalDiscountValue);

            this._priceTooltip.append(row);

            row = document.createElement('div');
            row.classList.add('card__tooltip__row');

            totalDiscount = document.createElement('span');
            totalDiscount.classList.add('card__tooltip__text');
            totalDiscount.classList.add('card__tooltip__text_grey');
            totalDiscount.textContent = 'Скидка покупателя 10%';
            row.append(totalDiscount);

            totalDiscountValue = document.createElement('span');
            totalDiscountValue.classList.add('card__tooltip__text');
            totalDiscountValue.textContent = '−30 сом';
            row.append(totalDiscountValue);

            this._priceTooltip.append(row);
        }
    
        this._cardImage.src = this._image;
        this._cardImage.alt = "Изображение: " + this._title;

        this._card.querySelector('.card__title').textContent = this._title;
        this._card.querySelector('.card__seller').textContent = this._seller;

        if (this._card.querySelector('.card__company')) {
            this._card.querySelector('.card__company').textContent = this._company.name;
        }
        
        this._card.querySelector('.card__price-new').textContent = this._newPrice;
        this._card.querySelector('.card__price-old').textContent = this._oldPrice;
        this._card.querySelector('.card__currency').textContent = this._currency;
        this._card.querySelector('.card__number').textContent = this._counterValue;

        let itemOptions = this._options;
        let optionList = [];
        const wideScreen = this._templateSelector === "#card-template-default" ? true : false;

        itemOptions.forEach(option => {
            let optionString = '';
            const keys = Object.keys(option);
            if (!wideScreen && keys.includes('Размер')) {
                const size = document.createElement('span');
                size.textContent = option['Размер'];
                size.classList.add('card__data');
                this._card.querySelector('.card__image-wrapper').append(size);
            }
            keys.forEach(key => {
                optionString = `${key}: ${option[key]}`;
            });
            const newOption = document.createElement('p');
            newOption.classList.add('card__option');
            newOption.textContent = optionString;
            optionList.push(newOption);
        });

        if (!wideScreen && optionList.length > 0) {
            optionList = optionList.slice(0, 1);
        }
        optionList.forEach(option => {
            optionContainer.append(option);
        });

        if (this._inStock !== -1) {
            const warning = document.createElement('p');
            warning.textContent = `Осталось ${this._inStock} шт.`;
            warning.classList.add('card__warning');
            this._warningContainer.append(warning);
        }

        this._initiateCounter();
        this._initiateTotal();

        this._checkbox.addEventListener('click', () => {
            this.cartCheckboxClick();
        });
        this._decreaseButton.addEventListener('click', () => {
            this._decreaseCounter();
        })
        this._increaseButton.addEventListener('click', () => {
            this._increaseCounter();
        })
    
        return this._card;
    }

    cartCheckboxClick() {
        const checked = this._checkbox.querySelector('.card__checkbox_checked');
        const unChecked = this._checkbox.querySelector('.card__checkbox_unchecked');

        if (checked.classList.contains('card__checkbox_hidden')) {
            checked.classList.remove('card__checkbox_hidden');
            unChecked.classList.add('card__checkbox_hidden');
            return;
        }
        checked.classList.add('card__checkbox_hidden');
        unChecked.classList.remove('card__checkbox_hidden');
    }

    setChecked() {
        const checked = this._checkbox.querySelector('.card__checkbox_checked');
        const unChecked = this._checkbox.querySelector('.card__checkbox_unchecked');
        checked.classList.add('card__checkbox_hidden');
        unChecked.classList.remove('card__checkbox_hidden');
    }

    setUnchecked() {
        const checked = this._checkbox.querySelector('.card__checkbox_checked');
        const unChecked = this._checkbox.querySelector('.card__checkbox_unchecked');
        checked.classList.remove('card__checkbox_hidden');
        unChecked.classList.add('card__checkbox_hidden');
    }

}