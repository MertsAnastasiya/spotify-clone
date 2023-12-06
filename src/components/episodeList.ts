import Controller from './controller';
import { EpisodesListItem } from './episodesListItem';
import { OnClickAction, OnClickEpisodeCard, OnClickPlayButton, ActionsButtons } from './types/type';

export class EpisodeList {
    private podcastId: number;

    private readonly controller: Controller;
    private readonly onClickEpisodeCard: OnClickEpisodeCard;
    private readonly onClickPlayButton: OnClickPlayButton;
    private readonly onClickAction: OnClickAction;

    constructor(
        podcatId: number,
        onClickEpisodeCard: OnClickEpisodeCard,
        onClickPlayButton: OnClickPlayButton,
        onClickAction: OnClickAction,
    ) {
        this.podcastId = podcatId;
        this.controller = new Controller();
        this.onClickEpisodeCard = onClickEpisodeCard;
        this.onClickPlayButton = onClickPlayButton;
        this.onClickAction = onClickAction;
    }

    public createList(): Element {
        const section: Element = document.createElement('section');
        section.classList.add('podcast__list');

        const latestHeader: Element = document.createElement('div');
        latestHeader.classList.add('title_up-next');
        latestHeader.textContent = 'Latest Episode';

        section.appendChild(latestHeader);
        this.fetchData(section);

        return section;
    }

    private fetchData(parent: Element): void {
        this.controller.fetchEpisodesById(this.podcastId).then((data) =>
            data.forEach((item, index) => {
                if (index === 0) {
                    const episode: Element = new EpisodesListItem(
                        parent,
                        this.onClickEpisodeCard.bind(this, item.id),
                        (id: number, event: Event) => this.onClickPlayButton(id, event),
                        (action: ActionsButtons, event) => this.onClickAction(action, event),
                    ).createEpisode(item);
                    episode.classList.add('episode_latest');
                    parent.appendChild(episode);

                    const listHeader: Element = document.createElement('h3');
                    listHeader.classList.add('h3');
                    listHeader.classList.add('episodes__header');
                    listHeader.textContent = 'Episodes';
                    parent.appendChild(listHeader);
                } else {
                    new EpisodesListItem(
                        parent,
                        this.onClickEpisodeCard.bind(this, item.id),
                        (id: number, event: Event) => this.onClickPlayButton(id, event),
                        (type: ActionsButtons, event: Event) => this.onClickAction(type, event as MouseEvent),
                    ).createEpisode(item);
                }
            })
        );
    }
}
