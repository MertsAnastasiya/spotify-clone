import { querySelectNonNull } from './utils';

export class ActionsPopup {
    public draw(): HTMLElement {
        const menu: HTMLElement = document.createElement('div');
        menu.classList.add('playlist-menu');
        menu.classList.add('hidden');
        this.generatePlaylistItems(menu);

        return menu;
    }

    private createItem(name: string, parent: Element): void {
        const item: Element = document.createElement('p');
        item.classList.add('playlist-menu__item');
        item.addEventListener('click', (event: Event) => {
            event.stopPropagation();
            // console.log((event.target as HTMLElement).textContent);
            this.changePopupVisibility();
            // this.library.addItemToPlaylist(name, String(parent.getAttribute('episodeId')));

            // this.library.removeItemFromPlaylist(name, String(14254099615));
        });
        item.textContent = name;
        parent.append(item);
    }

    private generatePlaylistItems(parent: Element): void {
        this.createItem('Add to Liked', parent);
        this.createItem('Playlist 1', parent);
    }

    private changePopupVisibility(): void {
        const menu: HTMLElement = querySelectNonNull('.playlist-menu');
        menu.classList.toggle('hidden');
    }
}
