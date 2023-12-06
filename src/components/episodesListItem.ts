import { AppStorage } from './storage';
import { ActionsButtons, Episode, OnClickAction, OnClickEpisodeCard, OnClickPlayButton } from './types/type';
import { formatTime, replaceTags } from './utils';

export class EpisodesListItem {
    private readonly parent: Element;
    private readonly onClickEpisodeCard: OnClickEpisodeCard;
    private readonly onClickPlayButton: OnClickPlayButton;
    private readonly onClickAction: OnClickAction;

    constructor(parent: Element, onClickEpisodeCard: OnClickEpisodeCard, onClickPlayButton: OnClickPlayButton, onClickAction: OnClickAction) {
        this.parent = parent;
        this.onClickEpisodeCard = onClickEpisodeCard;
        this.onClickPlayButton = onClickPlayButton;
        this.onClickAction = onClickAction;
    }

    public createEpisode(data: Episode): Element {
        const episode: HTMLElement = document.createElement('div');
        episode.classList.add('episode');
        episode.dataset.id = data.id.toString();

        episode.appendChild(this.createEpisodeImage(data.image));
        episode.appendChild(this.createEpisodeInfo(data));
        episode.addEventListener('click', this.onClickEpisodeCard.bind(this, data.id));
        this.parent.appendChild(episode);

        return episode;
    }

    private createEpisodeImage(image: string): Element {
        const episodeImage: HTMLImageElement = document.createElement('img');
        episodeImage.classList.add('episode__image_spoti');
        episodeImage.src = image || `../assets/img/fav-icon.png`;
        episodeImage.alt = 'Episode Image';

        return episodeImage;
    }

    private createEpisodeInfo(data: Episode): Element {
        const episodeInfo: Element = document.createElement('div');

        const episodeTitle: Element = document.createElement('h4');
        episodeTitle.classList.add('episode__title_spoti');
        episodeTitle.innerHTML = data.title;

        const episodeDescription: Element = document.createElement('div');
        episodeDescription.classList.add('episode__description');
        episodeDescription.textContent = replaceTags(data.description);

        episodeInfo.appendChild(episodeTitle);
        episodeInfo.appendChild(episodeDescription);

        const wrapper: Element = document.createElement('div');
        wrapper.classList.add('episode-actions__wrapper');
        wrapper.append(this.createEpisodePlayer(data.duration, data.id));
        wrapper.append(this.createActionsButton(data.id));//???
        episodeInfo.append(wrapper);

        return episodeInfo;
    }

    private createEpisodePlayer(duration: number, id: number): Element {
        const player: Element = document.createElement('div');
        player.classList.add('player_small');

        const playButton: Element = document.createElement('div');
        playButton.classList.add('button');
        playButton.classList.add('button-play');
        playButton.setAttribute('id', `${id}`);

        playButton.addEventListener('click', (event: Event) => {
            event.stopPropagation();
            this.onClickPlayButton(id, event);
        });

        const episodeTime: Element = document.createElement('div');
        episodeTime.classList.add('episode__time_spoti');

        const episodeDuration: Element = document.createElement('div');
        episodeDuration.classList.add('duration');
        episodeDuration.textContent = formatTime(duration);

        const episodeProgress: HTMLInputElement = document.createElement('input');
        episodeProgress.type = 'range';
        episodeProgress.classList.add('progress_small');
        episodeProgress.classList.add('unvisible');

        player.appendChild(playButton);
        player.appendChild(episodeTime);
        player.appendChild(episodeDuration);
        player.appendChild(episodeProgress);

        return player;
    }

    private createActionsButton(dataId: number): Element {
        const wrapper: Element = document.createElement('div');
        wrapper.classList.add('actions_spoti');
        wrapper.classList.add('hidden');

        const shareButton: Element = document.createElement('div');
        shareButton.classList.add('button_action');
        shareButton.classList.add('button_share');
        shareButton.addEventListener('click', (event: Event) => this.onClickAction(ActionsButtons.Share, event as MouseEvent));

        const saveButton: HTMLElement = document.createElement('div');
        saveButton.classList.add('button_action');
        const appStorage: AppStorage = new AppStorage();
        const currentUser: string = appStorage.getCurrentUser();
        const savedEpisodes: number[] = appStorage.getSavedEpisode(currentUser);
        savedEpisodes.includes(dataId) ?  saveButton.classList.add('button_saved') : saveButton.classList.add('button_save');

        saveButton.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();
            saveButton.classList.toggle('button_save');
            saveButton.classList.toggle('button_saved');
            this.onClickAction(ActionsButtons.Save, event);
        });
        // const path = window.location.hash.split('/');
        // if (path[0] === '#saved' || path[0] === '#savedPodcast')
        // {
        //     saveButton.dataset.id = episodeId.toString();
        //     saveButton.classList.add('saved');
        //     saveButton.addEventListener('click', (event) => {
        //         event.stopPropagation();
        //         const playlistName = path[0] === '#saved' ? 'likedPodcasts' : (path[1] as string).replace(/(%20)/g, ' ');
        //         this.library.removeItemFromPlaylist(playlistName, saveButton.dataset.id as string)
        //         .then(()=>{
        //             setTimeout(()=> {
        //                 window.location.href = path.join('/');
        //             }, 1000);
        //         })
        //         ;
        //     });
        // }
        // else
        // {
        //     saveButton.classList.add('save');
        // }

        const downloadButton: Element = document.createElement('div');
        downloadButton.classList.add('button_action');
        downloadButton.classList.add('download');
        downloadButton.addEventListener('click', (event: Event) => this.onClickAction(ActionsButtons.Download, event as MouseEvent));

        wrapper.appendChild(shareButton);
        wrapper.appendChild(saveButton);
        wrapper.appendChild(downloadButton);

        return wrapper;
    }
}
