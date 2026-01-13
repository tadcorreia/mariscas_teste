class App {
    constructor() {
        this.video = new VideoManager('v1', 'v2');
        this.ui = new UIManager();
        this.engine = new StoryEngine(this.video, this.ui);
        this.music = document.getElementById('bg-audio');
        this.musicVolume = document.getElementById('music-volume');
        this.init();
        this.setupAudio();
    }

    init() {
        const save = Storage.load();
        this.ui.renderStoryList(
            window.STORIES, 
            (id) => this.startNewGame(id),
            () => this.continueGame(save),
            !!save
        );
    }

    async startNewGame(storyId) {
        this.ui.hideMenu();
        await this.engine.startStory(storyId);
    }

    async continueGame(save) {
        this.ui.hideMenu();
        await this.engine.startStory(save.storyId, save);
    }

    async goBack() {
        await this.engine.goBack();
    }

    setupAudio() {
        if (!this.music || !this.musicVolume) return;

        const initialVolume = 0.4;
        this.music.volume = initialVolume;
        this.musicVolume.value = Math.round(initialVolume * 100);

        this.musicVolume.addEventListener('input', (e) => {
            const value = Number(e.target.value) / 100;
            this.music.volume = value;
        });

        const tryPlay = () => {
            this.music.play().catch(() => {});
        };

        tryPlay();
        window.addEventListener('click', tryPlay, { once: true });
    }
}

window.app = new App();
