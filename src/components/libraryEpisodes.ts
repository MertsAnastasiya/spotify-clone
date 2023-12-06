import Controller from './controller';
import { OnClickEpisodeCard, OnClickPlayButton, OnClickAction, ActionsButtons, StorageEpisode } from './types/type';
import { querySelectNonNull } from './utils';
import { AppStorage } from './storage';
import { EpisodesListItem } from './episodesListItem';

export class LibraryEpisodes {
    private readonly controller: Controller;
    private readonly onClickEpisodeCard: OnClickEpisodeCard;
    private readonly onClickPlayButton: OnClickPlayButton;
    private readonly onClickAction: OnClickAction;
    private readonly playlistName: string;
    public storage = new AppStorage();

    constructor(
        onClickEpisodeCard: OnClickEpisodeCard,
        onClickPlayButton: OnClickPlayButton,
        onClickAction: OnClickAction,
        playlistName = 'likedPodcasts'
    ) {
        this.controller = new Controller();
        this.onClickEpisodeCard = onClickEpisodeCard;
        this.playlistName = playlistName;
        this.onClickPlayButton = onClickPlayButton;
        this.onClickAction = onClickAction;
    }

    public async draw(): Promise<void> {
        const mainContainer: Element = querySelectNonNull<Element>('.main__container');
        mainContainer.innerHTML = '';

        mainContainer.appendChild(this.createHeader());
        mainContainer.appendChild(this.createList());
    }

    private createHeader(): Element {
        const header: Element = document.createElement('div');
        header.classList.add('library__episodes__header');

        const imageWrapper: Element = document.createElement('div');
        imageWrapper.classList.add('library__episodes__wrapper');

        const image: Element = document.createElement('div');
        image.classList.add('library__episodes__image');
        imageWrapper.appendChild(image);

        const info: Element = document.createElement('div');
        info.classList.add('episodeContent__header__info');
        const title: Element = document.createElement('h1');
        title.classList.add('episodeContent__title');
        title.classList.add('h1');
        title.textContent = this.playlistName === 'likedPodcasts' ? 'Your Liked Episodes' : this.playlistName;

        // const creator: Element = document.createElement('div');
        // creator.classList.add('creator');
        // creator.textContent = `UserName • 2 episodes`;

        header.appendChild(imageWrapper);
        info.appendChild(title);
        // info.appendChild(creator);
        header.appendChild(info);

        return header;
    }

    private createList(): Element {
        const wrapper: Element = document.createElement('div');
        const appStorage = new AppStorage();
        const array = appStorage.getSavedEpisode(appStorage.getCurrentUser());
        const episodeOrder: StorageEpisode[] = [];
        array.forEach((item) => {
            this.controller.fetchEpisodeById(item).then((data) => {
                episodeOrder.push({ id: data.id, currentDuration: 0 });
                this.storage.setEpisodeOrder(episodeOrder);
                return new EpisodesListItem(
                    wrapper,
                    (episodeId: number) => this.onClickEpisodeCard(episodeId),
                    (episodeId: number, event: Event) => this.onClickPlayButton(episodeId, event),
                    (type: ActionsButtons, event: Event) => this.onClickAction(type, event as MouseEvent)
                ).createEpisode(data);
            });
        });

        return wrapper;
    }
}
