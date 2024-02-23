import {computed, makeAutoObservable, runInAction} from "mobx";
import {createContext} from "react";

import {PiGuitar, PiMusicNotesSimple, PiPauseCircleBold, PiPauseCircleFill, PiPlayCircleBold, PiPlayCircleFill, PiPlaylist, PiSkipBackFill, PiSkipForwardFill, PiSpeakerHigh, PiSpeakerLow, PiSpeakerNone, PiSpeakerSlash, PiTimer, PiVinylRecord} from "react-icons/pi";
import {Song} from "./types";

const iconSize = 32;
const playIconSize = 56;
const skipIconSize = 24;
const iconClassName = "hover:text-neutral-300 transition-colors duration-75";
export const iconsContext = createContext({
    iconSize: iconSize,
    play: <PiPlayCircleFill size={playIconSize} className={iconClassName} />,
    playOutline: <PiPlayCircleBold size={playIconSize} className={iconClassName} />,
    playSmall: <PiPlayCircleFill size={iconSize} className={iconClassName} />,
    pause: <PiPauseCircleFill size={playIconSize} className={iconClassName} />,
    pauseOutline: <PiPauseCircleBold size={playIconSize} className={iconClassName} />,
    pauseSmall: <PiPauseCircleFill size={iconSize} className={iconClassName} />,
    prev: <PiSkipBackFill size={skipIconSize} className={iconClassName} />,
    next: <PiSkipForwardFill size={skipIconSize} className={iconClassName} />,
    volumeHigh: <PiSpeakerHigh size={iconSize} className={iconClassName} />,
    volumeMedium: <PiSpeakerLow size={iconSize} className={iconClassName} />,
    volumeLow: <PiSpeakerNone size={iconSize} className={iconClassName} />,
    volumeMute: <PiSpeakerSlash size={iconSize} className={iconClassName} />,
    album: <PiVinylRecord size={iconSize} className={iconClassName} />,
    song: <PiMusicNotesSimple size={iconSize} className={iconClassName} />,
    playlist: <PiPlaylist size={iconSize} className={iconClassName} />,
    artist: <PiGuitar size={iconSize} className={iconClassName} />,
    timer: <PiTimer size={iconSize} className={iconClassName} />,
});

export class PlayerStore {
    audio = new Audio();
    isReady = false;
    isPlaying = false;
    isMuted = false;
    volume = 0.7;
    duration = 0;
    seek = 0;
    songIndex = -1;
    songList: Song[] = [];
    isVisible = false;

    constructor(songs: Song[]) {
        this.songList = songs;
        this.audio.preload = "metadata";
        if (this.songCount > 0) {
            this.songIndex = 0;
            this.audio.src = this.currentSong.src;
        }
        makeAutoObservable(this, {
            audio: false,
            songCount: computed,
            currentSong: computed,
        });

        this.audio.addEventListener('ended', (ev) => {
            const target = (ev.currentTarget as HTMLAudioElement);
            runInAction(() => {
                if (this.skip(1)) {
                    this.play();
                }
            });
        });
        this.audio.addEventListener('durationchange', (ev) => {
            const target = (ev.currentTarget as HTMLAudioElement);
            runInAction(() => {
                this.duration = target.duration;
            });
        });
        this.audio.addEventListener('canplay', (ev) => {
            const target = (ev.currentTarget as HTMLAudioElement);
            runInAction(() => {
                target.volume = this.volume;
                this.isReady = true;
            });
        });
        this.audio.addEventListener('timeupdate', (ev) => {
            const target = (ev.currentTarget as HTMLAudioElement);
            runInAction(() => {
                this.seek = target.currentTime;
            });
        });
    }

    loadSong(song: Song) {
        //TODO: optimize song list somehow
        //TODO: also preload the next song in collection, so that the forward skip button works
        if (this.songIndex < 0) {
            this.songIndex = 0;
        }
        this.addSong(song);
    }

    addSong(song: Song) {
        this.addSongs([song]);
    }
    addSongs(songs: Song[]) {
        this.songList.push(...songs);
        console.debug(this.songList);
    }
    clearSongs() {
        this.songList = [];
        this.songIndex = -1;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    play() {
        this.audio.play();
        this.isPlaying = true;
    }
    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.isMuted = !this.isMuted;
    };

    setVolume(vol: number) {
        this.audio.volume = vol;
        this.volume = vol;
    }
    setProgress(time: number) {
        this.audio.currentTime = time;
        this.seek = time;
    }

    skip(increment: number): boolean {
        return this.skipToIndex(this.songIndex + increment);
    }
    skipToIndex(index: number): boolean {
        if (index > this.songCount - 1 || index < 0) {
            return false;
        }
        this.songIndex = index;
        this.audio.src = this.currentSong.src;
        this.audio.load();
        return true;
    }
    skipToID(id: string) {
        for (let i = 0; i < this.songList.length; i++) {
            const song = this.songList[i];
            if (song.id == id) {
                this.skipToIndex(i);
            }
        }
    }
    delayedPlay(ms: number = 500) {
        setTimeout(() => {
            this.play();
        }, ms);
    }

    get songCount() {
        return this.songList.length;
    }

    get currentSong() {
        return this.songList[this.songIndex];
    }

    get isEmpty() {
        return (this.songList.length == 0);
    }
}

export const playerStoreContext = createContext(new PlayerStore([]));
