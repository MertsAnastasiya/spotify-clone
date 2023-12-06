import { querySelectNonNull } from './utils';

type OnClickAccount = (email: string) => void;

export default class Login {
    private onClickAccount: OnClickAccount;
    private user: string;

    constructor(onClickAccount: OnClickAccount, email: string) {
        this.onClickAccount = onClickAccount;
        this.user = email;
    }

    public draw(): void {
        this.changeStateOfAccount();
    }

    private changeStateOfAccount(): void {
        const menu: HTMLElement = querySelectNonNull('.menu');

        const accountButton = document.createElement('div');
        accountButton.classList.add('menu__item', 'account');

        const accountLogo = document.createElement('span');
        accountLogo.classList.add( 'account__logo', 'menu__item-logo');
        accountButton.append(accountLogo);

        const accountText = document.createElement('span');
        accountText.classList.add('account__text');
        accountText.textContent = this.user || 'Sign in';
        accountText.append(accountLogo);

        accountButton.append(accountLogo);
        accountButton.append(accountText);
        accountButton.append(this.createAccountMenu());


        accountButton.addEventListener('click', () => {
            if (this.user === '') {
                this.createModalWindowForLogin();
                return;
            }
            this.changeVisibilityOfPopup();
        });
        menu.append(accountButton);
    }

    private createAccountMenu(): HTMLElement {
        const popup: HTMLElement = document.createElement('div');
        popup.classList.add('popup-account');
        popup.append(this.createItemForPopup('logout'));
        return popup;
    }

    private createInputField(name: string): HTMLElement {
        const input: HTMLElement = document.createElement('input');
        input.classList.add('input', 'input_text');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', `${name}`);
        input.setAttribute('id', `${name}`);

        return input;
    }

    private createFormButton(name: string): HTMLElement {
        const button: HTMLElement = document.createElement('p');
        button.classList.add('button', 'button_spoti');
        button.textContent = `${name}`;
        button.addEventListener('click', () => {
            const email: HTMLInputElement = querySelectNonNull('#email');
            // const password: HTMLInputElement = querySelectNonNull('#password');
            console.log(email.value);

            if (email.value !== '') {
                console.log('here');
                const modal: Element = querySelectNonNull<Element>('.modal');
                this.user = email.value;
                this.onClickAccount(email.value);
                modal.remove();
            }
        });
        return button;
    }

    static renameButton(newName: string): void {
        const button: HTMLElement = querySelectNonNull('.account__text');
        button.textContent = newName;
    }

    private createItemForPopup(name: string): HTMLElement {
        const item: HTMLElement = document.createElement('p');
        item.classList.add('popup-account__item', `popup-account__item_${name}`, 'menu__item-text');
        item.textContent = name;
        item.addEventListener('click', (event: Event) => {
            event.stopImmediatePropagation();
            this.user = '';
            Login.renameButton('Sign in');
            this.changeVisibilityOfPopup();
            this.onClickAccount('');
        });
        return item;
    }

    private changeVisibilityOfPopup(): void {
        const popup: HTMLElement = querySelectNonNull('.popup-account');
        popup.classList.toggle('show');
    }

    private createModalWindowForLogin(): void {
        const body: HTMLElement = querySelectNonNull('body');
        const modal: HTMLElement = document.createElement('div');
        modal.classList.add('modal');

        const modalForm: HTMLElement = document.createElement('div');
        modalForm.classList.add('modal__form');

        const modalTitle: HTMLElement = document.createElement('h2');
        modalTitle.classList.add('modal__title', 'modal__title--personal');
        modalTitle.textContent = `Enter your data:`;
        modalForm.append(modalTitle);

        modalForm.append(this.createInputField('email'));
        modalForm.append(this.createInputField('password'));
        modalForm.append(this.createFormButton('log in'));

        modal.append(modalForm);

        body.prepend(modal);
    }
}
