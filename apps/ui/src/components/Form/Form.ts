import './form.css';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';

export class Form extends BaseComponent<'form'> {
  constructor() {
    super('form');

    this.addClass('Form-root');
  }

  onSubmit(callback: (formData: FormData) => void) {
    this.root.addEventListener('submit', event => {
      event.preventDefault();
      callback(new FormData(this.root));
    });
    return this;
  }

  setMethod(method: 'DELETE' | 'GET' | 'POST' | 'PUT') {
    this.setAttribute('method', method);
    return this;
  }
}
