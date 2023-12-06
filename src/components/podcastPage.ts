import Controller from './controller';
import {
    ActionsButtons,
    // episode,
    OnClickAction,
    OnClickEpisodeCard,
    OnClickPlayButton,
    PodcastCard
} from './types/type';
import { querySelectNonNull, replaceTags } from './utils';
// import { Library } from './api/libraryController';
// import { EMAIL } from './constants';
import { EpisodeList } from './episodeList';
import { AppStorage } from './storage';
import { ActionsPopup } from './actionsPopup';

export default class PodcastPage {
    private readonly podcastId: number;
    private readonly controller: Controller;
    // private readonly data: Promise<episode[]>;
    private readonly onClickEpisodeCard: OnClickEpisodeCard;
    private readonly onClickPlayButton: OnClickPlayButton;

    // private readonly library: Library;
    // private readonly currentEpesodeId: number;
    // private readonly isPlay: boolean;
    private readonly onClickAction: OnClickAction;

    constructor(
        podcastId: number,
        currentEpesodeId: number,
        isPlay: boolean,
        onClickEpisodeCard: OnClickEpisodeCard,
        onClickPlayButton: OnClickPlayButton,
        onClickAction: OnClickAction
    ) {
        this.podcastId = podcastId;
        this.controller = new Controller();
        // this.data = this.controller.fetchEpisodesById(podcastId);
        this.onClickEpisodeCard = onClickEpisodeCard;
        this.onClickPlayButton = onClickPlayButton;

        // this.library = new Library(EMAIL);

        // this.currentEpesodeId = currentEpesodeId;
        // this.isPlay = isPlay;

        this.onClickAction = onClickAction;
    }

    public draw(): void {
        const mainContainer = document.querySelector('.main__container') as HTMLElement;
        mainContainer.innerHTML = '';
        mainContainer.append(this.createPodcastHeader());
        mainContainer.append(this.createSubscribeSection(this.podcastId));

        const podcastData: Element = document.createElement('div');
        podcastData.classList.add('podcast__data');

        podcastData.append(
            new EpisodeList(
                this.podcastId,
                (id: number) => this.onClickEpisodeCard(id),
                (id: number, event: Event) => this.onClickPlayButton(id, event),
                (type: ActionsButtons, event: Event) => this.onClickAction(type, event as MouseEvent)
            ).createList()
        );

        const podcastAbout = document.createElement('section');
        podcastAbout.classList.add('podcast__description');
        const aboutHeader = document.createElement('h3');
        aboutHeader.classList.add('h3');
        aboutHeader.textContent = 'About';
        const aboutText: Element = document.createElement('div');
        aboutText.classList.add('podcast__about__text');
        podcastAbout.append(aboutHeader);
        podcastAbout.append(aboutText);
        podcastData.append(podcastAbout);

        mainContainer.append(podcastData);
        const playlistMenu: HTMLElement = new ActionsPopup().draw();
        mainContainer.append(playlistMenu);
        this.setPodcastData(this.podcastId);
    }

    private createPodcastHeader(): Element {
        const podcastHeader: Element = document.createElement('div');
        podcastHeader.classList.add('podcast__header');

        const podcastImage: HTMLImageElement = document.createElement('img');
        podcastImage.classList.add('podcast__image');

        const podcastInfo: Element = document.createElement('div');
        podcastInfo.classList.add('podcast__info');

        const podcastTitle: Element = document.createElement('h1');
        podcastTitle.classList.add('podcast__title');
        podcastTitle.classList.add('h1');

        podcastInfo.appendChild(podcastTitle);
        podcastHeader.appendChild(podcastImage);
        podcastHeader.appendChild(podcastInfo);

        return podcastHeader;
    }

    private createSubscribeSection(podcastId: number): Element {
        //     <div class="button button_spoti button_actions">...</div>

        const wrapper: Element = document.createElement('div');
        wrapper.classList.add('podcast__subscribe');
        const buttonFollow: Element = document.createElement('div');
        buttonFollow.classList.add('button');
        buttonFollow.classList.add('button_follow');

        const storage: AppStorage = new AppStorage();
        const followedPodcasts: Set<number> = new Set(storage.getFollowedPodcasts());
        if (followedPodcasts.has(podcastId)) {
            buttonFollow.classList.add('button_bright');
            buttonFollow.textContent = '- Followed';
        } else {
            buttonFollow.classList.add('button_spoti');
            buttonFollow.textContent = '+ Follow';
        }

        buttonFollow.addEventListener('click', () => {
            const isAdd: boolean = !followedPodcasts.has(podcastId);
            buttonFollow.classList.toggle('button_bright');
            buttonFollow.classList.toggle('button_spoti');

            if (followedPodcasts.has(podcastId)) {
                buttonFollow.textContent = '+ Follow';
                // this.library.removeItemFromPlaylist('subscribedPodcasts', String(podcastId));
            } else {
                buttonFollow.textContent = '- Follow';
                // this.library.addItemToPlaylist('subscribedPodcasts', String(podcastId));
            }
            storage.setFollowedPodcasts(podcastId, isAdd);
        });

        wrapper.append(buttonFollow);

        return wrapper;
    }

    private async setPodcastData(id: number): Promise<void> {
        const podcastData: PodcastCard = await this.controller.fetchById(id);
        const { image, title, description } = podcastData;
        const podcastImg = document.querySelector('.podcast__image') as HTMLImageElement;
        const podcastTitle = document.querySelector('.podcast__title') as HTMLElement;
        const podcastDescription: Element = querySelectNonNull('.podcast__about__text');
        podcastImg.src = image || `../assets/img/fav-icon.png`;
        podcastTitle.innerText = title;
        podcastDescription.textContent = replaceTags(description);
    }

    private addListeners(): void {
        const saveButtons = document.querySelectorAll('.save') as NodeListOf<HTMLElement>;
        saveButtons.forEach((elem) => {
            (elem as HTMLElement).addEventListener('click', (event) => {
                event.stopPropagation();
                console.log('save to playlist');

                //                 const actionsContainer = elem.parentElement as HTMLElement;
                //                 const inputElem = `
                //                 <input class="playlist__input" list="playlists" placeholder="chose playlist">
                //                 <img data-id=${elem.dataset.id} class='addButton' style="width: 20px; height: 20px; cursor: pointer; border: 1px solid #993aed;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/OOjs_UI_icon_add.svg/1024px-OOjs_UI_icon_add.svg.png">
                //                 `;
                //                 actionsContainer.innerHTML = '';
                //                 actionsContainer.innerHTML = inputElem;
                //                 const addButton = document.querySelector('.addButton') as HTMLElement;
                //                 const playlistInput = document.querySelector('.playlist__input') as HTMLInputElement;
                //                 actionsContainer.style.opacity = '1';
                //                 playlistInput?.addEventListener('click', (e) => e.stopPropagation());
                //                 addButton?.addEventListener('click', async (event) => {
                //                     event.stopPropagation();
                //                     await this.library
                //                         .addItemToPlaylist(playlistInput.value, elem.dataset.id as string)
                //                         .then(() => {
                //                             actionsContainer.innerHTML = '';
                //                             actionsContainer.innerHTML = `
                //                                 <div class="button_action share"></div>
                //                                 <div class="button_action saved" data-id=${elem.dataset.id}>
                //                                 </div>
                //                                 <div class="button_action download"></div>`;
                //                             actionsContainer.style.opacity = '';
                //
                //                             return playlistInput.value;
                //                         })
                //                         .then((playlist) => {
                //                             const savedButton = document.querySelector('.saved') as HTMLElement;
                //                             savedButton.addEventListener('click', async (event) => {
                //                                 event.stopPropagation();
                //                                 await this.library.removeItemFromPlaylist(playlist, elem.dataset.id as string);
                //                                 actionsContainer.innerHTML = '';
                //                                 actionsContainer.innerHTML = `
                //                                 <div class="button_action share"></div>
                //                                 <div class="button_action save" data-id=${elem.dataset.id}>
                //                                 </div>
                //                                 <div class="button_action download"></div>`;
                //                             });
                //                         });
                //                 });
            });
        });
    }
}
