export class LibraryNavigation {
    public draw(currentPage: string): Element {
        const nav: Element = document.createElement('nav');
        nav.classList.add('library__navigation');
        const list: Element = document.createElement('ul');
        list.classList.add('navigation__list');

        list.appendChild(this.createNavItem('playlists', currentPage));
        list.appendChild(this.createNavItem('subscriptions', currentPage));
        nav.appendChild(list);

        return nav;
    }

    private createNavItem(name: string, currentPage: string): Element {
        const item: Element = document.createElement('li');
        item.classList.add('nav__item');
        item.classList.add(`item_${name}`);

        if(name === currentPage) {
            item.classList.toggle('item_active');
        }

        const link: HTMLAnchorElement = document.createElement('a');
        link.classList.add('link');
        name === 'episodes' ? (link.href = `/#saved`) : (link.href = `/#${name}List`);
        link.textContent = `${name}`;
        item.addEventListener('click', () => item.classList.toggle('item_active'));
        item.appendChild(link);

        return item;
    }
}
