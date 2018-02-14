// ====================================== //
// @name "Button Control (05.10.2013)"
// @author "eXtremeHunter"
// ====================================== //
var mouseInControl = false;
var oldButton, downButton;
var buttonTimerStarted = false;
var mainMenuOpen = false;

function buttonEventHandler(x, y, m) {

    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

    var c = caller();

    var thisButton;

    mouseInControl = false;

    for (var i in b) {

        if (b[i].mouseInThis(x, y)) {
            mouseInControl = true;
            thisButton = b[i];
        }

    }

    switch (c) {

    case "on_mouse_move":

        if (downButton) return;

        if (oldButton && oldButton != thisButton) {
            oldButton.changeState(0);
        }
        if (thisButton && thisButton != oldButton) {
            thisButton.changeState(1);
        }

        oldButton = thisButton;

        break;

    case ("on_mouse_lbtn_down"):
    case ("on_mouse_lbtn_dblclk"):

        if (thisButton) {
            thisButton.changeState(2);
            downButton = thisButton;
        }

        break;

    case "on_mouse_lbtn_up":

        if (downButton) {

            downButton.onClick();

            if (mainMenuOpen) {
                thisButton = undefined;
                mainMenuOpen = false;
            }

            thisButton ? thisButton.changeState(1) : downButton.changeState(0);

            downButton = undefined;

        }

        break;

    case ("on_mouse_leave"):

        oldButton = undefined;

        if (downButton) return; // for menu buttons

        for (var i in b) {

            if (b[i].state != 0) {
                b[i].changeState(0);
            }

        }

        break;

    }

}
// =================================================== //
WindowState = {
    Normal: 0,
    Minimized: 1,
    Maximized: 2
}

function Button(x, y, w, h, id, img) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.img = img;
    this.state = 0;
    this.hoverAlpha = 0;
    this.downAlpha = 0;

}
// =================================================== //
Button.prototype.mouseInThis = function (x, y) {

    return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);

}
// =================================================== //
Button.prototype.repaint = function () {

    var expXY = 2,
        expWH = expXY * 2;

    window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);

}
// =================================================== //
Button.prototype.changeState = function (state) {

    this.state = state;
    buttonAlphaTimer();

}
// =================================================== //
Button.prototype.onClick = function () {

    switch (this.id) {

    case "Stop":
        fb.Stop();
        break;
    case "Previous":
        fb.Prev();
        break;
    case "Play/Pause":
        fb.PlayOrPause();
        break;
    case "Next":
        fb.Next();
        break;
    case "Playback/Random":
        fb.RunMainMenuCommand("Playback/Random");
        break;
    case "OpenExplorer":
    if (!safeMode) {
        try {
            WshShell.Run("explorer.exe /e,::{20D04FE0-3AEA-1069-A2D8-08002B30309D}");
            //WshShell.Run("explorer.exe /e, D:\\MUSA");
        } catch (e) {
            fb.trace(e)
        };
    }
        break;
    case "Minimize":
        fb.RunMainMenuCommand("View/Hide");
        break;
    case "Maximize":
        try {
            if (maximizeToFullScreen ? !utils.IsKeyPressed(VK_CONTROL) : utils.IsKeyPressed(VK_CONTROL)) {
                UIHacks.FullScreen = !UIHacks.FullScreen;
            } else {
                if (UIHacks.MainWindowState == WindowState.Maximized) UIHacks.MainWindowState = WindowState.Normal;
                else UIHacks.MainWindowState = WindowState.Maximized;
            }
        } catch (e) {
            fb.trace(e + " Disable WSH safe mode")
        }
        break;
    case "Close":
        fb.Exit();
        break;
    case "File":
    case "Edit":
    case "View":
    case "Playback":
    case "Library":
    case "Help":
        onMainMenu(this.x, this.y + this.h, this.id);
        break;
    case "Playlists":
        onPlaylistsMenu(this.x, this.y + this.h);
        break;
    case "Repeat":
        var pbo = fb.PlaybackOrder;
        if (pbo == playbackOrder.Default) fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
        else if (pbo == playbackOrder.RepeatPlaylist) fb.PlaybackOrder = playbackOrder.RepeatTrack;
        else if (pbo == playbackOrder.RepeatTrack) fb.PlaybackOrder = playbackOrder.Default;
        else fb.PlaybackOrder = playbackOrder.RepeatPlaylist;
        break;
    case "Shuffle":
        var pbo = fb.PlaybackOrder;
        if (pbo != playbackOrder.ShuffleTracks) fb.PlaybackOrder = playbackOrder.ShuffleTracks;
        else fb.PlaybackOrder = playbackOrder.Default;
        break;
    case "Mute":
        fb.VolumeMute();
        break;
    case "Front":
        coverSwitch(0);
        break;
    case "Back":
        coverSwitch(1);
        break;
    case "CD":
        coverSwitch(2);
        break;
    case "Artist":
        coverSwitch(3);
        break;

    }

}
// =================================================== //

function getPlaybackOrder() {

    var order;


    for (var i in playbackOrder) {

        if (fb.PlaybackOrder == playbackOrder[i]) {

            order = i;
            break;

        }

    }

    return order;
}
// =================================================== //

function onPlaylistsMenu(x, y) {

    mainMenuOpen = true;
    var lists = window.CreatePopupMenu();
    var playlistCount = fb.PlaylistCount;
    var playlistId = 3;
    lists.AppendMenuItem(MF_STRING, 1, "Playlist manager...");
    lists.AppendMenuSeparator();
    lists.AppendMenuItem(MF_STRING, 2, "Create New Playlist");
    lists.AppendMenuSeparator();
    for (var i = 0; i != playlistCount; i++) {
        lists.AppendMenuItem(MF_STRING, playlistId + i, fb.GetPlaylistName(i).replace(/\&/g, "&&") + " [" + fb.PlaylistItemCount(i) + "]" + (fb.IsAutoPlaylist(i) ? " (Auto)" : "") + (i == plman.PlayingPlaylist ? " \t(Now Playing)" : ""));
    }

    var id = lists.TrackPopupMenu(x, y);

    switch (id) {
    case 1:
        fb.RunMainMenuCommand("View/Playlist Manager");
        break;
    case 2:
        fb.CreatePlaylist(playlistCount, "");
        fb.ActivePlaylist = fb.PlaylistCount;
        break;

    }
    for (var i = 0; i != playlistCount; i++) {
        if (id == (playlistId + i)) fb.ActivePlaylist = i; // playlist switch
    }
    lists.Dispose();
    return true;
}
// =================================================== //

function onMainMenu(x, y, name) {

    mainMenuOpen = true;

    var menuManager = fb.CreateMainMenuManager();

    var menu = window.CreatePopupMenu();
    var ret;

    if (name) {

        menuManager.Init(name);
        menuManager.BuildMenu(menu, 1, 128);

        ret = menu.TrackPopupMenu(x, y);

        if (ret > 0) {
            menuManager.ExecuteByID(ret - 1);
        }
    }

    menuManager.Dispose();
    menu.Dispose();

}
// =================================================== //

function refreshPlayButton() {

    b[2].img = (fb.IsPlaying ? (fb.IsPaused ? btnImg.Play : btnImg.Pause) : btnImg.Play);
    b[2].repaint();

}
// =================================================== //

function caller() {
    var caller = /^function\s+([^(]+)/.exec(arguments.callee.caller.caller);
    if (caller) return caller[1];
    else return 0;
}

// =================================================== //

function buttonAlphaTimer() {

    var trace = 0;

    var turnButtonTimerOff = false,
        buttonHoverInStep = 50,
        buttonHoverOutStep = 15,
        buttonDownInStep = 100,
        buttonDownOutStep = 50,
        buttonTimerDelay = 25;

    if (!buttonTimerStarted) {

        buttonTimer = window.SetInterval(function () {

            for (var i in b) {

                switch (b[i].state) {

                case 0:

                    b[i].hoverAlpha = Math.max(0, b[i].hoverAlpha -= buttonHoverOutStep);
                    b[i].downAlpha = Math.max(0, b[i].downAlpha -= Math.max(0, buttonDownOutStep));
                    b[i].repaint();

                    break;
                case 1:

                    b[i].hoverAlpha = Math.min(255, b[i].hoverAlpha += buttonHoverInStep);
                    b[i].downAlpha = Math.max(0, b[i].downAlpha -= buttonDownOutStep);
                    b[i].repaint();

                    break;
                case 2:

                    b[i].downAlpha = Math.min(255, b[i].downAlpha += buttonDownInStep);
                    b[i].hoverAlpha = Math.max(0, b[i].hoverAlpha -= buttonDownInStep);
                    b[i].repaint();

                    break;
                }
            }

            //---> Test button alpha values and turn button timer off when it's not required;

            var testAlpha = 0,
                currentAlphaIsFull = false,
                alphaIsZero = true;

            for (var i in b) {

                if ((b[i].hoverAlpha == 255 || b[i].downAlpha == 255)) {

                    currentAlphaIsFull = true;
                    continue;

                }

                alphaIsZero = (testAlpha += (b[i].hoverAlpha + b[i].downAlpha)) == 0;

            }

            if ((alphaIsZero && currentAlphaIsFull) || alphaIsZero) {

                turnButtonTimerOff = true;

            }

            if (turnButtonTimerOff) {

                window.ClearInterval(buttonTimer);
                buttonTimerStarted = false;
                trace && print("buttonTimerStarted = " + buttonTimerStarted);

            }

        }, buttonTimerDelay);

        //---> buttonTimer end;

        buttonTimerStarted = true;
        trace && print("buttonTimerStarted = " + buttonTimerStarted);

    }

}