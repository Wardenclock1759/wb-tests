export default class Card {
    constructor(cardData, templateSelector) {
        this._title = cardData.title;
        this._options = cardData.options;
        this._seller = cardData.seller;
        this._company = cardData.company;
        this._inStock = cardData.inStock;

        const [number, currency] = this._splitString(cardData.newPrice);
        this._newPrice = this._prettify(number);
        this._currency = currency;
        this._oldPrice = this._formatOldPrice(cardData.oldPrice);
        
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

    _formatOldPrice(string) {
        const [number, currency] = this._splitString(string);
        const formattedNumber = this._prettify(number);
        return `${formattedNumber} ${currency}`;
    }

    _splitString(string) {
        const currencyIndex = string.indexOf(" ");
        const number = string.slice(0, currencyIndex);
        const currency = string.slice(currencyIndex + 1);
        return [number, currency];
    }

    generateCard() {
        this._card = this._getTemplate();
        this._checkbox = this._card.querySelector('.card__checkbox');
        this._cardImage = this._card.querySelector('.card__image');
        const optionContainer = this._card.querySelector('.card__option-wrapper');
    
        this._cardImage.src = this._image;
        this._cardImage.alt = "Изображение: " + this._title;

        this._card.querySelector('.card__title').textContent = this._title;
        this._card.querySelector('.card__seller').textContent = this._seller;
        this._card.querySelector('.card__company').textContent = this._company;
        this._card.querySelector('.card__price-new').textContent = this._newPrice;
        this._card.querySelector('.card__price-old').textContent = this._oldPrice;
        this._card.querySelector('.card__currency').textContent = this._currency;

        const itemOptions = this._options;
        itemOptions.forEach(option => {
            let optionString = '';
            const keys = Object.keys(option);
            keys.forEach(key => {
                optionString = `${key}: ${option[key]}`;
            })
            const newOption = document.createElement('p');
            newOption.classList.add('card__option');
            newOption.textContent = optionString;
            optionContainer.append(newOption);
        });
    
        return this._card;
    }
}