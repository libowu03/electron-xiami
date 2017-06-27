const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');
const storage = require('electron-json-storage');

class AppTray {
    constructor(player) {
        this.player = player;
        this.init();
    }

    init() {

        //initial the tray
        let trayIcon;
        if (process.platform === 'linux' || process.platform === 'win32') {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../../assets/icon_white.png'));
        } else {
            trayIcon = nativeImage.createFromPath(path.join(__dirname, '../../../assets/icon_black_macos.png'))
        }
        trayIcon.setTemplateImage(true);
        this.tray = new Tray(trayIcon);
        this.tray.setToolTip('Xiami Music');

        //set the context menu
        const context = Menu.buildFromTemplate([
            {label: 'Show', click: () => this.player.show()},
            {label: 'Play | Pause', icon: path.join(__dirname, '../../../assets/icon_play.png'), click: () => this.togglePlay()},
            {label: 'Next', icon: path.join(__dirname, '../../../assets/icon_next.png'), click: () => this.player.next()},
            {label: 'Previous', icon: path.join(__dirname, '../../../assets/icon_previous.png'), click: () => this.player.previous()},
            {label: 'Separator', type: 'separator'},
            {label: 'Setting', icon: path.join(__dirname, '../../../assets/icon_settings.png'), click: () => console.log("Open setting window")},
            {label: 'Exit', click: () => this.cleanupAndExit()},
        ]);

        this.tray.setContextMenu(context);

        this.tray.on('click', () => this.togglePlayerWindow());
    }

    togglePlay() {
        this.player.getWebContents().executeJavaScript("document.querySelector('.pause-btn')", (result) => {
            result ? this.player.pause() : this.player.play();
        });
    }

    togglePlayerWindow() {
        if (this.player.isVisible()) {
            this.player.hide();
        } else {
            this.player.show();
        }
    }

    cleanupAndExit() {
        storage.clear((error) => {
            if (error) throw error;
            console.log(app.getPath('userData'));
            app.exit(0);
        });
    }
}

module.exports = AppTray;