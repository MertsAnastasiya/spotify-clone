import { User } from './type';

interface IController {
    fetchRecent(): void;
    fetchSearchCall(search: string): void;
    fetchById(id: number): void;
    fetchEpisodesById(id: number): void;
}

interface IAdmin {
    listUsers(): void;
    allPlaylists(): void;
}

interface IAuthentication {
    signIn(): void;
}

interface IRegestration {
    addUser(newUser: User): void;
}

interface IAuthorization {
    signOut(): void;
    updateUser(updateFields: User): void;
    deleteUser(): void;
}

interface ILibrary {
    userLibrary(): void;
    addNewPlaylist(playlistName: string): void;
    renamePlaylist(playlistName: string, newPlaylistName: string): void;
    addItemToPlaylist(playlistName: string, itemId: string): void;
    removeItemFromPlaylist(playlistName: string, itemId: string): void;
    removePlaylist(playlistName: string): void;
}

export { IController, IAuthorization, ILibrary, IAdmin, IAuthentication, IRegestration }
