import { StorageEpisode } from './types/type';

export class AppStorage {

    public setEpisodeOrder(episodeOrder: StorageEpisode[]): void {
        localStorage.setItem('episodeOrder', JSON.stringify(episodeOrder));
    }

    public getEpisodeOrder(): StorageEpisode[] {
        return JSON.parse(localStorage.getItem('episodeOrder') || '[]');
    }

    public setLastListened(lastListened: StorageEpisode): void {
        localStorage.setItem('lastListened', JSON.stringify(lastListened));
    }

    public getLastListened(): StorageEpisode {
        return JSON.parse(localStorage.getItem('lastListened') || '{"id":0,"currentDuration":0}');
    }

    public getFollowedPodcasts(): number[] {
        return JSON.parse(localStorage.getItem('followedPodcasts') || '[]');
    }

    public setFollowedPodcasts(podcastId: number, isAdd: boolean): void {
        let followedPodcasts: number[] = this.getFollowedPodcasts();
        followedPodcasts.push(podcastId);

        if (!isAdd) {
            followedPodcasts = followedPodcasts.filter(item => item !== podcastId);
            localStorage.setItem('followedPodcasts', JSON.stringify(followedPodcasts));
            return;
        }
        localStorage.setItem('followedPodcasts', JSON.stringify(followedPodcasts));
    }

    public login(email: string): void {
        // localStorage.setItem('user', JSON.stringify(email));
        localStorage.setItem('user', 'nastya@gmail.com');
    }

    public logout(): void {
        localStorage.removeItem('user');
    }

    public getCurrentUser(): string {
        return localStorage.getItem('user') !== null
            ? JSON.parse(localStorage.getItem('user') || '') : '';
    }

    public getSavedEpisode(user: string): number[] {
        return JSON.parse(localStorage.getItem(`${user}-saved`) || '[]');
    }

    public setSavedEpisode(user: string, episodes: number[]): void {
        localStorage.setItem(`${user}-saved`, JSON.stringify(episodes));
    }
}
