import { applePodcastPageDOM, spotifyPodcastPageDOM } from './templates/podcastPageDom';
import Controller from './controller';
import {
    ActionsButtons,
    episode,
    OnClickAction,
    onClickEpisodeCard,
    OnClickPlayButton,
    UserLibrary,
} from './types/type';
import { formatTime, replaceTags, requiresNonNull } from './utils';
import { Library } from './api/libraryController';
import { EMAIL } from './constants';

export default class PodcastPage {
    private readonly podcastId: number;
    private readonly controller: Controller;
    private readonly data: Promise<episode[]>;
    private readonly onClickEpisodeCard: onClickEpisodeCard;
    private readonly onClickPlayButton: OnClickPlayButton;

    private readonly library: Library;
    private readonly currentEpesodeId: number;
    private readonly isPlay: boolean;
    private readonly onClickAction: OnClickAction;

    constructor(
        podcastId: number,
        currentEpesodeId: number,
        isPlay: boolean,
        onClickEpisodeCard: onClickEpisodeCard,
        onClickPlayButton: OnClickPlayButton,
        onClickAction: OnClickAction
    ) {
        this.podcastId = podcastId;
        this.controller = new Controller();
        this.data = this.controller.fetchEpisodesById(podcastId);
        this.onClickEpisodeCard = onClickEpisodeCard;
        this.onClickPlayButton = onClickPlayButton;

        this.library = new Library(EMAIL);

        this.currentEpesodeId = currentEpesodeId;
        this.isPlay = isPlay;

        this.onClickAction = onClickAction;
    }

    public drawPodcastPage(layout = 'apple'): void {
        const mainDOM = document.querySelector('.main__container') as HTMLElement;
        let spotifyEpisodeElement = ``;
        let appleEpisodeElement = ``;
        switch (layout) {
            case 'apple':
                mainDOM.innerHTML = applePodcastPageDOM;
                this.addGeneralDescription(this.podcastId);
                this.data.then((episodes) => {
                    episodes.forEach((episode) => {
                        appleEpisodeElement = `
                          <div class="episode" data-id=${episode.id}>
                          <div class="episode__info">
                          <div class="episode__time">${episode.datePublishedPretty}</div>
                          <h4 class="episode__title">
                          ${episode.title}
                          <span class="episode__author">Authors</span>
                          </h4>
                          <div class="episode__description">
                          ${replaceTags(episode.description)}
                          </div>
                          <div class="player_small">
                          <div id=${episode.id} class="button button-play"></div>
                          <div class="progress_small unvisible"></div>
                          <div class="duration">${Math.floor(episode.duration / 60)} min ${
                            episode.duration % 60
                        } sec</div>
                          </div>
                          </div>
                          <div class="actions actions__container">
                          <div class="button_action save" data-id=${episode.id}></div>
                          <div class="button_action download"></div>
                          <div class="button_action add"></div>
                          </div>
                          </div>
                          `;
                        (document.querySelector('.episodes-list') as HTMLElement).innerHTML += appleEpisodeElement;
                        this.addListeners();
                    });
                });
                break;
            case 'spotify':
                mainDOM.innerHTML = spotifyPodcastPageDOM;
                this.addGeneralDescription(this.podcastId);
                this.data.then((episodes) => {
                    episodes.forEach((episode) => {
                        const episodeImg =
                            episode.image || (document.querySelector('.podcast__image') as HTMLImageElement).src;
                        const player = this.createSmallPlayer(episode);
                        spotifyEpisodeElement = `
                          <div class="episode" data-id=${episode.id}>
                              <img
                                  class="episode__image_spoti"
                                  src="${episodeImg}"
                                  alt="Episode image"
                              />
                              <div class="episode__info">
                                  <h4 class="episode__title_spoti">
                                  ${episode.title}
                                      <span class="episode__author">Author</span>
                                  </h4>
                                  <div class="episode__description">
                                  ${replaceTags(episode.description)}
                                  </div>
                                      <div class="progress_small unvisible"></div>

                                  </div>
                                  <div class="actions_spoti actions__container">

                                      <div class="button_action share"></div>
                                      <div class="button_action save" data-id=${episode.id}>
                                      </div>
                                      <div class="button_action download"></div>
                                  </div>
                              </div>
                          </div>
                         `;
                        (document.querySelector('.podcast__list') as HTMLElement).innerHTML += spotifyEpisodeElement;
                        document.querySelector('.podcast__list')?.append(player);
                        this.addListeners();
                    });
                });
                break;
        }
    }

    private addGeneralDescription(id: number) {
        this.controller.fetchById(id).then((podcastData) => {
            const podcastImg = document.querySelector('.podcast__image') as HTMLImageElement;
            const podcastTitle = document.querySelector('.podcast__title') as HTMLElement;
            const podcastDescription = (document.querySelector('.podcast__about__text') as HTMLElement) || undefined;
            podcastImg.src = podcastData.image || `../assets/img/fav-icon.png`;
            podcastTitle.innerText = podcastData.title;
            if (podcastDescription !== undefined) {
                podcastDescription.innerText = replaceTags(podcastData.description);
            }
        });
        // add playlist
        this.library.userLibrary().then((res) => {
            const userLibrary = res as UserLibrary;
            const playlists = Object.keys(userLibrary);
            const datalist = document.createElement('datalist');
            const main = document.querySelector('.main__container');
            datalist.id = 'playlists';
            playlists.forEach((elem) => {
                if (elem !== 'email' && elem !== 'subscribedPodcasts' && elem !== '_id') {
                    const option: HTMLOptionElement = document.createElement('option') as HTMLOptionElement;
                    option.value = elem;
                    datalist.appendChild(option);
                }
            });
            main?.appendChild(datalist);
        });
    }

    private addListeners(): void {
        const episodesWrapper: NodeListOf<Element> = requiresNonNull(document.querySelectorAll('.episode'));
        const follow = document.querySelector('.button_follow') as HTMLElement;

        follow.dataset.id = this.podcastId.toString();
        episodesWrapper.forEach((episodeWrapper) =>
            episodeWrapper.addEventListener('click', () =>
                this.onClickEpisodeCard(Number(episodeWrapper.getAttribute('data-id')))
            )
        );

        const buttonsPlay: NodeListOf<Element> = requiresNonNull(document.querySelectorAll('.button-play'));
        buttonsPlay.forEach((button) =>
            button.addEventListener('click', (event: Event) => {
                event.stopPropagation();
                this.onClickPlayButton(Number(button.getAttribute('id')), event);
            })
        );

        follow.addEventListener('click', () => {
            follow.style.background = '#993aed';
            follow.style.color = '#ffffff';
            follow.innerText = 'Followed';
            this.library.addItemToPlaylist('subscribedPodcasts', follow.dataset.id as string);
        });

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

        const buttonsShare: NodeListOf<Element> = requiresNonNull(document.querySelectorAll('.share'));
        buttonsShare.forEach((shareButton) => {
            shareButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.onClickAction(ActionsButtons.Share, event);
            });
        });

        const buttonsDownload: NodeListOf<Element> = requiresNonNull(document.querySelectorAll('.download'));
        buttonsDownload.forEach((dowloadButton) => {
            dowloadButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.onClickAction(ActionsButtons.More, event);
            });
        });
    }

    private createSmallPlayer(episode: episode): Element {
        const playerSmall: Element = document.createElement('div');
        playerSmall.classList.add('player_small');

        const playButton: Element = document.createElement('div');
        playButton.classList.add('button');
        playButton.classList.add('button-play');
        playButton.classList.add('play');
        playButton.setAttribute('id', `${episode.id}`);

        if (episode.id === this.currentEpesodeId && this.isPlay) {
            playButton.classList.add('pause');
        }

        const date: Element = document.createElement('div');
        date.classList.add('episode__time_spoti');
        date.textContent = episode.datePublishedPretty;

        const duration: Element = document.createElement('div');
        duration.classList.add('duration');
        duration.textContent = formatTime(episode.duration);

        playerSmall.append(playButton);
        playerSmall.append(date);
        playerSmall.append(duration);

        return playerSmall;
    }
}
