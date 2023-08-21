export default class Section {
    constructor(renderer, containerSelector) {
        this._renderer = renderer;
        this._container = document.querySelector(containerSelector);
    }
  
    addItem(element) {
        this._container.append(element);
    }
  
    clear() {
        this._container.innerHTML = '';
    }

    renderItems(items, template) {
        this.clear();
   
        items.forEach(item => {
            this._renderer(item, template);
        });
    }
}