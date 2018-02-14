// ====================================== //
// @name "Cover Panel (01.11.2013)"
// @author "eXtremeHunter"
// ====================================== //
var margin = window.GetProperty("Margin", 15);
var maxArtHeight = window.GetProperty("Max Art Height", 1000);
var showThumbs = window.GetProperty("Show Thumbs", false);
var thumbPos = Math.max(1, Math.min(4, window.GetProperty("Thumb Pos", 4)));
var thumbSize = window.GetProperty("Thumb Size", 50);
var thumbPadding = window.GetProperty("Thumb Padding", 10);
var useDiscMask = window.GetProperty("Use Disc Mask", true);
var cycleCovers = window.GetProperty("Cycle Covers", false);
var cycleInterval = window.GetProperty("Cycle Interval", "10000,22").split(",");
var displayedTrack = Math.max(1, Math.min(3, window.GetProperty("Displayed track", 1)));
var groupFormat = window.GetProperty("Group Format", "%album artist%%album%%discnumber%");
var isPhotoshopAwailable = false;

var artX = artY = artW = artH = artWidth = artHeight = ww = wh = artLeftMargin = artTopMargin = artRightMargin = artBottomMargin = 0;
var currentArtID = 0; // 0=front; 1=back; 2=cd; 3=artist;
var timer, cycleTimer;
var artArr = [];
var b = [];
var embeddedPopup;
var thumbMargin = margin;
var thumbsMargin = thumbSize + thumbMargin * 2;

var display = {
    auto: 1,
    playing: 2,
    selected: 3
};
var pos = {
    left: 1,
    top: 2,
    right: 3,
    bottom: 4
};
var frameColor = panelsLineColor;
// ============================ //

function on_paint(gr) {

    gr.FillSolidRect(0, 0, ww, wh, panelsBackColor);

    gr.SetTextRenderingHint(5);
    var SF = StringFormat(1, 1, 3, 0x1000);
    var art = artArr[currentArtID];
    var metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();

    if (art) {

        var x = artX,
            y = artY,
            w = artW,
            h = artH;
        artWidth = art[1];
        artHeight = art[2];

        if (w + h > 10) {
            gr.DrawImage(art[0], x + 2, y + 2, w - 4, h - 4, 0, 0, artWidth, artHeight);
            if (currentArtID != 2) gr.DrawRect(x, y, w - 1, h - 1, 1, frameColor);
            else if (useDiscMask) {
                gr.SetSmoothingMode(2);
                gr.DrawEllipse(x, y, w - 1, h - 1, 1, frameColor);
            }

            if (art[5] && embeddedPopup) {
                gr.FillSolidRect(x + 2, y + 22, w - 4, 30, RGBA(0, 0, 0, 150));
                gr.DrawString("Cannot open embedded image!", gdi.font("Segoe Ui Semibold", 14, 0), RGBA(245, 250, 255, 205), x + 22, y + 22, w - 44, 30, SF);
            }
        }

    } else if (art === null) {

        if (metadb && (metadb.RawPath.indexOf("http://") == 0) && utils.CheckFont("Webdings"))
            gr.DrawString("\uF0BB", gdi.font("Webdings", 130, 0), RGB(70, 70, 70), 0, 0, ww, wh, SF);
        else
            gr.DrawString(themeName + themeVersion, gdi.font("Segoe Ui Semibold", 24, 0), RGB(70, 70, 70), 0, 0, ww, wh, SF);


    } else {
        gr.DrawString("LOADING", gdi.font("Segoe Ui Semibold", 24, 0), RGB(70, 70, 70), x, y, ww, wh, SF);
    }

    if (showThumbs) {
        for (var i in b) {

            var x = b[i].x,
                y = b[i].y,
                w = b[i].w,
                h = b[i].h,
                art = artArr[i];

            if (art && art[3]) {

                gr.DrawImage(art[3], x + 2, y + 2, w - 4, h - 4, 0, 0, art[3].Width, art[3].Height, 0, 230);

            } else gr.DrawString(b[i].id, gdi.font("Segoe Ui", 14, 0), RGB(70, 70, 70), x, y, w, h, SF);

            gr.DrawRect(x, y, w - 1, h - 1, 1, frameColor);
            gr.DrawRect(x, y, w - 1, h - 1, 1, RGBA(170, 172, 174, b[i].hoverAlpha));
            gr.DrawRect(x, y, w - 1, h - 1, 1, RGBA(70, 70, 70, b[i].downAlpha));
        }
    }
}
// ============================ //

function on_size() {

    ww = window.Width;
    wh = window.Height;

    artLeftMargin = showThumbs && thumbPos == pos.left ? thumbsMargin : margin;
    artTopMargin = showThumbs && thumbPos == pos.top ? thumbsMargin : margin;
    artRightMargin = showThumbs && thumbPos == pos.right ? thumbsMargin : margin;
    artBottomMargin = showThumbs && thumbPos == pos.bottom ? thumbsMargin : margin;

    calcScale(artArr[currentArtID]);

    //---> Thumbs

    var x = y = 0;
    var w = thumbSize;
    var h = w;
    var p = thumbPadding;

    switch (thumbPos) {

    case pos.left:
        y = Math.max(0, Math.floor(wh / 2 - (4 * w + 3 * p) / 2));
        x = thumbMargin;
        break;
    case pos.top:
        y = thumbMargin;
        x = Math.max(0, Math.floor(ww / 2 - (4 * w + 3 * p) / 2));
        break;
    case pos.right:
        y = Math.max(0, Math.floor(wh / 2 - (4 * w + 3 * p) / 2));
        x = ww - w - thumbMargin;
        break;
    case pos.bottom:
        y = wh - artBottomMargin + thumbMargin;
        x = Math.max(0, Math.floor(ww / 2 - (4 * w + 3 * p) / 2));
        break;

    }

    var wp = w + p;
    var v = (thumbPos == pos.left || thumbPos == pos.right);

    b[0] = new Button(x, y, w, h, "Front");
    b[1] = new Button(x + (!v ? wp : 0), y + (v ? wp : 0), w, h, "Back");
    b[2] = new Button(x + (!v ? wp * 2 : 0), y + (v ? wp * 2 : 0), w, h, "CD");
    b[3] = new Button(x + (!v ? wp * 3 : 0), y + (v ? wp * 3 : 0), w, h, "Artist");

}
// ============================ //
var oldAlbum;
var currentAlbum;

(function getAlbumArt(metadb) {

    if (metadb === null) {
        artArr[currentArtID] = null;
        window.Repaint();
    }
    if (!metadb) return;

    currentAlbum = fb.TitleFormat(groupFormat).EvalWithMetadb(metadb);
    if (oldAlbum == currentAlbum) {
        if (artArr[currentArtID] === null) window.Repaint();
        return;
    }

    if (caller() != "reload") currentArtID = 0;
    artArr = [];
    window.Repaint();
    window.ClearInterval(timer);

    var artID = 0;

    timer = window.SetInterval(function () {

        utils.GetAlbumArtAsync(window.ID, metadb, (artID == 3) ? artID = 4 : artID);

        if (artID >= 3) {

            window.ClearInterval(timer);
            timerStarted = false;

        }

        artID++;

    }, 200);

    oldAlbum = currentAlbum;


})((fb.IsPlaying && displayedTrack != display.selected) ? fb.GetNowPlaying() : (displayedTrack != display.playing ? selectedItem() : null));
// ============================ //

function on_get_album_art_done(metadb, art_id, image, image_path) {

    if (!image) {
        artArr[art_id] = null;
        if (currentArtID == art_id) window.Repaint();
        return;
    }

    if (art_id == 4) art_id = 3;

    var artWidth = image.Width,
        artHeight = image.Height;

    if (art_id == 2 && artWidth != artHeight) {

        if (artHeight > maxArtHeight) image = image.Resize(maxArtHeight, maxArtHeight, 0);
        else image = image.Resize(artWidth, artWidth, 0);

    }

    if (currentAlbum == fb.TitleFormat(groupFormat).EvalWithMetadb(metadb)) {

        if (artHeight > maxArtHeight) {
            var size = artWidth / artHeight;

            var newHeight = maxArtHeight;
            var newWidth = maxArtHeight * size;

            image = image.Resize(newWidth, newHeight, 0);

        }

        var isEmbedded;
        image_path.slice(image_path.lastIndexOf(".") + 1) == fb.TitleFormat("$ext(%path%)").EvalWithMetadb(metadb) ? isEmbedded = true : isEmbedded = false;

        artArr[art_id] = [image];
        artArr[art_id][1] = image.Width;
        artArr[art_id][2] = image.Height;
        artArr[art_id][3] = image.Resize(image.Width, image.Height, 0); // workaround for windows xp (not displaying main image after thumb resize)
        artArr[art_id][3] = artArr[art_id][3].Resize(thumbSize, thumbSize, 0);
        artArr[art_id][4] = image_path;
        artArr[art_id][5] = isEmbedded;

        if (useDiscMask && art_id == 2) {
            var artWidth = image.Width,
                artHeight = image.Height,
                discMask = gdi.CreateImage(artWidth, artHeight),
                g = discMask.GetGraphics();
            g.FillSolidRect(0, 0, artWidth, artHeight, 0xffffffff);
            g.SetSmoothingMode(2);
            g.FillEllipse(1, 1, artWidth - 2, artHeight - 2, 0xff000000);
            discMask.ReleaseGraphics(g);
            artArr[art_id][0].ApplyMask(discMask);
            discMask.Dispose();

        }

        onCycleTimer(cycleCovers, artArr.length);

    }

    if (art_id == currentArtID) {
        calcScale(artArr[currentArtID]);
        window.RepaintRect(artX, artY, artW, artH);

    }

    if (showThumbs && b[art_id]) b[art_id].repaint();

}


// ============================ //

function on_playlist_switch() {

    if (fb.IsPlaying && (displayedTrack == display.auto || displayedTrack == display.playing)) return;
    getAlbumArt(selectedItem());

}
// ============================ //

function on_playlists_changed() {

    if (fb.IsPlaying && (displayedTrack == display.auto || displayedTrack == display.playing)) return;
    reload();

}
// ============================ //

function on_playback_stop(reason) {

    if (reason != 2) {

        if (displayedTrack == display.playing) {

            nullArt();

        } else {


            var metadb = selectedItem();

            metadb ? getAlbumArt(metadb) : nullArt();

        }

    }

}
// ============================ //

function on_playlist_items_added(playlist) {

    if (!fb.IsPlaying && displayedTrack != display.playing) {

        getAlbumArt(selectedItem());

    }
}
// ============================ //

function on_playlist_items_removed(playlist, new_count) {

    if (playlist == fb.ActivePlaylist && !new_count) {

        !fb.IsPlaying && nullArt();
        return;
    }
    if ((fb.IsPlaying && displayedTrack != display.selected) || (playlist != fb.ActivePlaylist)) return;


    getAlbumArt(selectedItem());
    oldAlbum = currentAlbum = undefined;

}
// ============================ //

function on_playback_starting(cmd, is_paused) {

    if (cmd == 6 && displayedTrack != display.selected) getAlbumArt(fb.GetNowPlaying());

}
// ============================ //

function on_playback_new_track(metadb) {

    if (displayedTrack != display.selected) getAlbumArt(metadb);

}
// ============================ //

function on_playlist_items_selection_change() {

    if ((fb.IsPlaying && displayedTrack == display.auto) || displayedTrack == display.playing) return;
    var metadb = selectedItem();
    metadb ? getAlbumArt(metadb) : nullArt();

}
// ============================ //

function on_mouse_move(x, y, m) {

    buttonEventHandler(x, y, m);

}
// ============================ //

function on_mouse_lbtn_down(x, y, m) {

    buttonEventHandler(x, y, m);

}
// ============================ //

function on_mouse_lbtn_dblclk() {

    if (!artArr[currentArtID]) return;

    if (artArr[currentArtID][5]) {

        embeddedPopup = true;
        window.RepaintRect(artX, artY, artW, artH);

        window.SetTimeout(function () {

            embeddedPopup = false;
            window.RepaintRect(artX, artY, artW, artH);

        }, 2000);

        return;

    }

    try {

        WshShell.Run("\"" + artArr[currentArtID][4] + "\"");

    } catch (e) {
        fb.trace(e)
    }

}
// ============================ //

function on_mouse_lbtn_up(x, y, m) {

    buttonEventHandler(x, y, m);

}
// ============================ //

function on_mouse_wheel(delta) {

    oldArtID = currentArtID;

    do {

        if (delta == -1) {

            currentArtID == 3 ? currentArtID = 0 : currentArtID++;

        } else if (delta == 1) {

            currentArtID == 0 ? currentArtID = 3 : currentArtID--;

        }

    } while (oldArtID != currentArtID && !artArr[currentArtID]);

    if (oldArtID != currentArtID) {

        calcScale(artArr[currentArtID]);
        window.Repaint();

    }
}
// ============================ //

function on_mouse_leave() {

    buttonEventHandler(0, 0, 0);

}
// ============================ //

function on_key_down(vkey) {

    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

    if (CtrlKeyPressed && vkey == VK_KEY_P) {
        fb.RunMainMenuCommand("File/Preferences");
    }

    if (vkey == 38) on_mouse_wheel(1);
    if (vkey == 40) on_mouse_wheel(-1);
    if (vkey == VK_F5) reload();
}
// ============================ //

function selectedItem() {

    var apl = plman.ActivePlaylist;
    var metadb = null;

    for (var i = 0, l = plman.PlaylistItemCount(apl); i != l; i++) {

        if (plman.IsPlaylistItemSelected(apl, i)) {
            metadb = plman.GetPlaylistItems(apl).Item(i);
            break;
        }

    }

    return metadb;

}
// ============================ //

function refresh() {

    on_size();
    window.Repaint();

}
// ============================ //

function reload() {

    oldAlbum = currentAlbum = undefined;

    if (!fb.PlaylistItemCount(fb.ActivePlaylist)) nullArt();
    else getAlbumArt(displayedTrack == display.selected ? fb.GetFocusItem() : (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem()));



}
// ============================ //  

function calcScale(art) {

    if (!art) return;

    var artWidth = art[1];
    var artHeight = art[2];

    var scaleX = 0,
        scaleY = 0,
        scaleW = (ww - artLeftMargin - artRightMargin) / artWidth,
        scaleH = (wh - artTopMargin - artBottomMargin) / artHeight,
        scale = Math.min(scaleW, scaleH);

    if (scaleW < scaleH) scaleY = Math.floor(((wh - artTopMargin - artBottomMargin) - artHeight * scale) / 2);
    else if (scaleW > scaleH) scaleX = Math.floor(((ww - artLeftMargin - artRightMargin) - artWidth * scale) / 2);

    artX = scaleX + artLeftMargin;
    artY = scaleY + artTopMargin;
    artW = Math.max(0, Math.floor(artWidth * scale));
    artH = Math.max(0, Math.floor(artHeight * scale));

}
// ============================ //

function coverSwitch(id) {

    if (!artArr[id]) return;

    currentArtID = id;

    calcScale(artArr[currentArtID]);
    window.Repaint();

}
// ============================ //
var cycleTimerStarted;
(function onCycleTimer(cycleCovers, artLength, bool) {

    if (cycleTimerStarted && (!cycleCovers || !artArr[currentArtID] || artLength <= 1 || bool == true)) {

        cycleTimerStarted = false;
        window.ClearInterval(cycleTimer);

    }

    if (cycleCovers && !cycleTimerStarted && artLength > 1) {

        cycleTimerStarted = true;

        cycleTimer = window.SetInterval(function () {

            on_mouse_wheel(-1);

        }, cycleInterval[0]);

    }

})(cycleCovers);
// ============================ //

function nullArt() {

    for (var i in artArr) {
        artArr[i] = null;
    }

    artArr[currentArtID] = null;

    oldAlbum = currentAlbum = undefined;
    onCycleTimer(false);
    refresh();

}
// ============================ //

(function () {
    try {
        WshShell.RegRead("HKEY_CURRENT_USER\\Software\\Adobe\\Photoshop\\");
    } catch (e) {}

    isPhotoshopAwailable = (e ? false : true);

})()
// ============================ //

function on_mouse_rbtn_up(x, y) {

    var cpm = window.CreatePopupMenu();
    var thumbs = window.CreatePopupMenu();
    var track = window.CreatePopupMenu();
    var cycle = window.CreatePopupMenu();
    var selectedItm = selectedItem();
    var web = window.CreatePopupMenu();

    var metadb = (fb.IsPlaying && displayedTrack != display.selected) ? fb.GetNowPlaying() : (displayedTrack != display.playing ? selectedItem() : null)

    thumbs.AppendMenuItem(MF_STRING, 1, "Thumbs show");
    thumbs.CheckMenuItem(1, showThumbs);
    thumbs.AppendMenuSeparator();
    var mf_string = (showThumbs ? MF_STRING : MF_GRAYED);
    thumbs.AppendMenuItem(mf_string, 2, "Thumbs left");
    thumbs.AppendMenuItem(mf_string, 3, "Thumbs top");
    thumbs.AppendMenuItem(mf_string, 4, "Thumbs right");
    thumbs.AppendMenuItem(mf_string, 5, "Thumbs bottom");
    thumbs.CheckMenuRadioItem(2, 5, thumbPos + 1);
    thumbs.AppendTo(cpm, MF_STRING | MF_POPUP, "Thumbs");
    cpm.AppendMenuSeparator();

    track.AppendMenuItem(MF_STRING, 6, "Automatic (current selection/playing item)");
    track.AppendMenuItem(MF_STRING, 7, "Playing item");
    track.AppendMenuItem(MF_STRING, 8, "Current selection");
    track.CheckMenuRadioItem(6, 8, displayedTrack + 5);
    track.AppendTo(cpm, MF_STRING | MF_POPUP, "Displayed track");

    cycle.AppendMenuItem(MF_STRING, 20, "Enable cycle");
    cycle.CheckMenuItem(20, cycleCovers);
    cycle.AppendMenuSeparator();
    var mf_string = (cycleCovers ? MF_STRING : MF_GRAYED);
    cycle.AppendMenuItem(mf_string, 21, "5 sec");
    cycle.AppendMenuItem(mf_string, 22, "10 sec");
    cycle.AppendMenuItem(mf_string, 23, "20 sec");
    cycle.AppendMenuItem(mf_string, 24, "30 sec");
    cycle.AppendMenuItem(mf_string, 25, "40 sec");
    cycle.AppendMenuItem(mf_string, 26, "50 sec");
    cycle.AppendMenuItem(mf_string, 27, "1 min");
    cycle.AppendMenuItem(mf_string, 28, "2 min");
    cycle.AppendMenuItem(mf_string, 29, "3 min");
    cycle.AppendMenuItem(mf_string, 20, "4 min");
    cycle.AppendMenuItem(mf_string, 31, "5 min");
    cycle.CheckMenuRadioItem(21, 31, cycleInterval[1]);
    cycle.AppendTo(cpm, MF_STRING | MF_POPUP, "Cycle covers");

    cpm.AppendMenuSeparator();
    cpm.AppendMenuItem(MF_STRING, 32, "Use disc mask");
    cpm.CheckMenuItem(32, useDiscMask);
    if (artArr[currentArtID]) {
        cpm.AppendMenuItem((safeMode || (artArr[currentArtID][5])) ? MF_GRAYED : MF_STRING, 33, "Open image");
        if (isPhotoshopAwailable)
            cpm.AppendMenuItem((safeMode || (artArr[currentArtID][5])) ? MF_GRAYED : MF_STRING, 34, "Open image with Photoshop");
        cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 35, "Open image folder");

    }

    cpm.AppendMenuItem((displayedTrack == display.playing && !fb.IsPlaying) ? MF_GRAYED : MF_STRING, 36, "Reload \tF5");

    //---> Weblinks
    cpm.AppendMenuSeparator();
    web.AppendMenuItem(MF_STRING, 50, "Google");
    web.AppendMenuItem(MF_STRING, 51, "Google Images");
    web.AppendMenuItem(MF_STRING, 52, "eCover");
    web.AppendMenuItem(MF_STRING, 53, "Wikipedia");
    web.AppendMenuItem(MF_STRING, 54, "YouTube");
    web.AppendMenuItem(MF_STRING, 55, "Last FM");
    web.AppendMenuItem(MF_STRING, 56, "Discogs");
    web.AppendTo(cpm, (safeMode || !metadb) ? MF_GRAYED : MF_STRING | MF_POPUP, "Weblinks");
    cpm.AppendMenuSeparator();

    if (utils.IsKeyPressed(VK_SHIFT)) {

        cpm.AppendMenuItem(MF_STRING, 61, "Console");
        cpm.AppendMenuItem(MF_STRING, 62, "Restart");
        cpm.AppendMenuItem(MF_STRING, 63, "Preferences...");
        cpm.AppendMenuSeparator();
        cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 64, "Configure script...");
        cpm.AppendMenuItem(MF_STRING, 65, "Configure...");
    }
    cpm.AppendMenuItem(MF_STRING, 66, "Panel properties...");

    var id = cpm.TrackPopupMenu(x, y);

    switch (id) {

    case 1:
        showThumbs = !showThumbs;
        window.SetProperty("Show Thumbs", showThumbs);
        refresh();
        break;
    case 2:
        thumbPos = pos.left;
        window.SetProperty("Thumb Pos", thumbPos);
        refresh();
        break;
    case 3:
        thumbPos = pos.top;
        window.SetProperty("Thumb Pos", thumbPos);
        refresh();
        break;
    case 4:
        thumbPos = pos.right;
        window.SetProperty("Thumb Pos", thumbPos);
        refresh();
        break;
    case 5:
        thumbPos = pos.bottom;
        window.SetProperty("Thumb Pos", thumbPos);
        refresh();
        break;
    case 6:
        displayedTrack = display.auto;
        window.SetProperty("Displayed Track", displayedTrack);
        fb.IsPlaying ? getAlbumArt(fb.GetNowPlaying()) : (selectedItm ? getAlbumArt(selectedItm) : nullArt());
        break;
    case 7:
        displayedTrack = display.playing;
        window.SetProperty("Displayed Track", displayedTrack);
        fb.IsPlaying ? getAlbumArt(fb.GetNowPlaying()) : nullArt();
        break;
    case 8:
        displayedTrack = display.selected;
        window.SetProperty("Displayed Track", displayedTrack);
        selectedItm ? getAlbumArt(selectedItm) : nullArt();
        break;
    case 20:
        cycleCovers = !cycleCovers;
        window.SetProperty("Cycle Covers", cycleCovers);
        onCycleTimer(cycleCovers, artArr.length);
        break;
    case 21:
        setInterval(5000, id);
        break;
    case 22:
        setInterval(10000, id);
        break;
    case 23:
        setInterval(20000, id);
        break;
    case 24:
        setInterval(30000, id);
        break;
    case 25:
        setInterval(40000, id);
        break;
    case 26:
        setInterval(50000, id);
        break;
    case 27:
        setInterval(60000, id);
        break;
    case 28:
        setInterval(120000, id);
        break;
    case 29:
        setInterval(180000, id);
        break;
    case 30:
        setInterval(240000, id);
        break;
    case 31:
        setInterval(300000, id);
        break;
    case 32:
        useDiscMask = !useDiscMask;
        window.SetProperty("Use Disc Mask", useDiscMask);
        reload();
        break;
    case 33:
        try {
            WshShell.Run("\"" + artArr[currentArtID][4] + "\"");
        } catch (e) {}
        break;
    case 34:
        try {
            WshShell.Run("Photoshop " + "\"" + artArr[currentArtID][4] + "\"");
        } catch (e) {}
        break;
    case 35:
        try {
            WshShell.Run("explorer /select," + "\"" + artArr[currentArtID][4] + "\"");
        } catch (e) {}
        break;
    case 36:
        reload();
        break;
    case 50:
        link("google", metadb);
        break;
    case 51:
        link("googleImages", metadb);
        break;
    case 52:
        link("eCover", metadb);
        break;
    case 53:
        link("wikipedia", metadb);
        break;
    case 54:
        link("youTube", metadb);
        break;
    case 55:
        link("lastFM", metadb);
        break;
    case 56:
        link("discogs", metadb);
        break;
    case 61:
        fb.ShowConsole();
        break;
    case 62:
        fb.RunMainMenuCommand("File/Restart");
        break;
    case 63:
        fb.RunMainMenuCommand("File/Preferences");
        break;
    case 64:
        try {

            WshShell.Run("notepad.exe themes\\" + themeName + "\\Scripts\\Panel_Cover.js");

        } catch (e) {
            fb.trace(e)
        };
        break;
    case 65:
        window.ShowConfigure();
        break;
    case 66:
        window.ShowProperties();
        break;


    }

    function setInterval(iv, id) {

        cycleInterval = [iv, id];
        window.SetProperty("Cycle Interval", cycleInterval.toString());

        onCycleTimer(cycleCovers, artArr.length, true);

    }

    thumbs.Dispose();
    track.Dispose();
    cycle.Dispose();
    cpm.Dispose();
    web.Dispose();

    return true;

}