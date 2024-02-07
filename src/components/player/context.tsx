import {computed, makeAutoObservable, runInAction} from "mobx";
import {createContext} from "react";
import {MdEqualizer} from "react-icons/md";

import {PiPauseCircleFill, PiPlayCircleFill, PiSkipBackFill, PiSkipForwardFill, PiSpeakerHigh, PiSpeakerLow, PiSpeakerNone, PiSpeakerSlash, PiVinylRecord} from "react-icons/pi";
import {Song} from "./types";

const iconSize = 32;
const playIconSize = 56;
const skipIconSize = 24;
const iconClassName = "hover:text-neutral-300 transition-colors duration-75";
export const iconsContext = createContext({
    iconSize: iconSize,
    play: <PiPlayCircleFill size={playIconSize} className={iconClassName} />,
    pause: <PiPauseCircleFill size={playIconSize} className={iconClassName} />,
    prev: <PiSkipBackFill size={skipIconSize} className={iconClassName} />,
    next: <PiSkipForwardFill size={skipIconSize} className={iconClassName} />,
    volumeHigh: <PiSpeakerHigh size={iconSize} className={iconClassName} />,
    volumeMedium: <PiSpeakerLow size={iconSize} className={iconClassName} />,
    volumeLow: <PiSpeakerNone size={iconSize} className={iconClassName} />,
    volumeMute: <PiSpeakerSlash size={iconSize} className={iconClassName} />,
    equalizer: <MdEqualizer size={iconSize} />,
    album: <PiVinylRecord size={iconSize} className={iconClassName} />
});

export class PlayerStore {
    audio = new Audio();
    isReady = false;
    isPlaying = false;
    isMuted = false;
    volume = 0.7;
    duration = 0;
    seek = 0;
    songIndex = 0;
    songList: Song[] = [];

    constructor(songs: Song[]) {
        this.songList = songs;
        this.audio.preload = "metadata";
        if (this.songCount != 0) {
            this.audio.src = this.currentSong.src;
        }
        makeAutoObservable(this, {
            audio: false,
            songCount: computed,
            currentSong: computed,
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

    addSong(song: Song) {
        this.songList.push(song);
    }
    addSongs(songs: Song[]) {
        songs.forEach(song => {
            this.addSong(song);
        });
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

    skip(increment: number) {
        this.skipToIndex(this.songIndex + increment);
    }
    skipToIndex(index: number) {
        this.songIndex = index;
        this.audio.src = this.currentSong.src;
        this.audio.load();
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
}

export const playerStoreContext = createContext(new PlayerStore([]));
