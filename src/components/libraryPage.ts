import { LibraryNavigation } from './libraryNavigation';
import { AppStorage } from './storage';
import { OnClickLink, onClickSavedPlaylist } from './types/type';
import { querySelectNonNull } from './utils';

export class LibraryPage {
    private readonly onClickLink: OnClickLink;
    private readonly onClickSavedPlaylist: onClickSavedPlaylist;
    private appStorage = new AppStorage();

    constructor(onClickLink: OnClickLink, onClickSavedPlaylist: onClickSavedPlaylist) {
        this.onClickLink = onClickLink;
        this.onClickSavedPlaylist = onClickSavedPlaylist;
    }

    public draw(): void {
        const mainContainer: Element = querySelectNonNull<Element>('.main__container');
        mainContainer.innerHTML = '';
        const header: Element = document.createElement('h2');
        header.classList.add('h2');
        header.textContent = 'Playlists';

        const wrapper: Element = document.createElement('div');
        wrapper.classList.add('playlists');

        mainContainer.appendChild(new LibraryNavigation().draw('playlists'));
        mainContainer.appendChild(header);
        wrapper.appendChild(this.createBlockEpisodes());

        mainContainer.appendChild(wrapper);
        this.updateLibrary();
    }

    private createBlockEpisodes(): Element {
        const wrapper: Element = document.createElement('div');
        wrapper.classList.add('save-episodes');
        const header: Element = document.createElement('h2');
        header.textContent = 'Your liked episodes';
        const amount: Element = document.createElement('div');
        amount.classList.add('amount-episodes');
        amount.textContent = `0 episodes`;
        wrapper.appendChild(header);
        wrapper.appendChild(amount);

        wrapper.addEventListener('click', () => this.onClickLink('saved'));

        return wrapper;
    }

//     private createAddButton(): Element {
//         // const library: Library = this.library;
//         const wrapper: Element = document.createElement('div');
//         wrapper.classList.add('playlist');
//         const image: HTMLImageElement = document.createElement('img');
//         image.src =
//             'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/OOjs_UI_icon_add.svg/1024px-OOjs_UI_icon_add.svg.png';
//         image.alt = 'Add playlist';
//         image.classList.add('playlist__image');
//
//         const wrapperName: Element = document.createElement('div');
//         wrapperName.classList.add('name__wrapper');
//
//         const playlistName: Element = document.createElement('h3');
//         playlistName.textContent = `New playlist`;
//
//         wrapperName.append(playlistName);
//         wrapper.appendChild(image);
//         wrapper.appendChild(wrapperName);
//         image.addEventListener('click', addPlaylist);
//
//         function addPlaylist(event: Event) {
//             event.stopPropagation();
//             const inputElem: HTMLInputElement = document.createElement('input');
//             inputElem.placeholder = 'playlist';
//             inputElem.classList.add('input-rename');
//             playlistName.innerHTML = '';
//             playlistName.append(inputElem);
//             inputElem.addEventListener('keyup', (event) => {
//                 event.stopPropagation();
//                 if (event.key === 'Enter') {
//                     playlistName.innerHTML = '';
//                     if (inputElem.value != '' && Number.isNaN(Number(inputElem.value)) === true) {
//                         playlistName.innerHTML = inputElem.value;
//                         library.addNewPlaylist(inputElem.value).then(() => {
//                             setTimeout(() => {
//                                 window.location.href = '/#library';
//                             }, 1000);
//                         });
//                     } else {
//                         alert('Error: wrong name');
//                     }
//                 }
//             });
//         }
//         return wrapper;
//     }

//     private createPlaylist(playlist: string): Element {
//         const library = this.library;
//         const wrapper: Element = document.createElement('div');
//         wrapper.classList.add('playlist');
//
//         const image: HTMLImageElement = document.createElement('img');
//         image.src = './assets/img/fav-icon.png';
//         image.alt = 'Playlist Image';
//         image.classList.add('playlist__image');
//
//         const wrapperName: Element = document.createElement('div');
//         wrapperName.classList.add('name__wrapper');
//
//         const playlistName: Element = document.createElement('h3');
//         playlistName.textContent = `${playlist}`;
//         const deletePlaylist: Element = document.createElement('div');
//         deletePlaylist.classList.add('delete');
//         const renamePlaylist: Element = document.createElement('div');
//         renamePlaylist.classList.add('rename');
//         const divEdit: Element = document.createElement('div');
//         divEdit.classList.add('edit__wrapper');
//         divEdit.append(deletePlaylist, renamePlaylist);
//         wrapperName.append(divEdit);
//
//         deletePlaylist.addEventListener('click', (event) => {
//             event.stopPropagation();
//             library.removePlaylist(playlist).then(() => {
//                 setTimeout(() => {
//                     window.location.href = '/#library';
//                 }, 1000);
//             });
//         });
//         renamePlaylist.addEventListener('click', rename);
//
//         function rename(event: Event) {
//             event.stopPropagation();
//             const inputElem: HTMLInputElement = document.createElement('input');
//             inputElem.placeholder = playlist;
//             inputElem.classList.add('input-rename');
//             playlistName.innerHTML = '';
//             playlistName.append(inputElem);
//             inputElem.addEventListener('keyup', async (event) => {
//                 if (event.key === 'Enter') {
//                     playlistName.innerHTML = '';
//                     if (inputElem.value != '') {
//                         playlistName.innerHTML = inputElem.value;
//                         await library.renamePlaylist(playlist, inputElem.value);
//                         setTimeout(() => {
//                             window.location.href = '/#library';
//                         }, 1000);
//                     } else {
//                         playlistName.innerHTML = playlist;
//                     }
//                 }
//             });
//         }
//         //TO DO
//         //will be change
//         wrapper.addEventListener('click', (event) => {
//             const target = event.target as HTMLElement;
//             if (target.tagName === 'INPUT') {
//                 event.stopPropagation();
//             } else {
//                 this.onClickSavedPlaylist(playlist);
//             }
//         });
//
//         wrapperName.appendChild(playlistName);
//         wrapperName.append(divEdit);
//         wrapper.appendChild(image);
//         wrapper.appendChild(wrapperName);
//
//         return wrapper;
//     }
//
    private updateLibrary() {
        const amountEpisodes: HTMLElement = querySelectNonNull('.amount-episodes');
        const currentUser: string = this.appStorage.getCurrentUser();
        const savedEpisodes: number[] = this.appStorage.getSavedEpisode(`${currentUser}`);
        amountEpisodes.textContent = `${savedEpisodes.length} episodes`;
        // const playlistWrapper = document.querySelector('.playlists') as HTMLElement;
    }
}
