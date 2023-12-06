import mainPageDOM from './templates/mainPageDom';
import { querySelectNonNull } from './utils';

export default class MainPage {
    public draw(): void {
        const body: HTMLElement = querySelectNonNull('body');
        body.innerHTML = mainPageDOM;
    }
}
