// ====================================== //
// @name "Info Panel (27.10.2013)"
// @author "eXtremeHunter"
// ====================================== //
var thisPanelName = "Info";
//--->

var rowH = window.GetProperty("user.Row Height", 20);
var minRowH = 10;
if (rowH < minRowH) {
    rowH = minRowH;
    window.SetProperty("user.Row Height", minRowH);
}

//--->

var listLeft = window.GetProperty("user.List Left", 15);
var listTop = window.GetProperty("user.List Top", 15);
var listRight = window.GetProperty("user.List Right", 15);
var listBottom = window.GetProperty("user.List Bottom", 15);
var scrollbarRight = window.GetProperty("user.Scrollbar Right", 15);
var titleColorNormal = RGB(125, 130, 135);
var listLength;

//---> init list step

var listStep = [];
var step = [];
var s = window.GetProperty("system.List Step", "");
s.indexOf(",") != -1 ? step = s.split(",") : step[0] = Math.max(0, s);
listStep[0] = (step[0] == undefined ? 0 : (isNaN(step[0]) ? 0 : Math.max(0, step[0])));
window.SetProperty("system.List Step", listStep.toString());
var activeList = 0;

//--->
var infoNameFont = gdi.font("Segoe Ui Semibold", 12, 0);
var infoValueFont = gdi.font("Segoe Ui", 12, 0);
var lineColorNormal = panelsLineColor;
//===============================//  

function on_paint(gr) {

    if (!listLength) return;

    gr.SetTextRenderingHint(5);

    var x = listX;
    var y = listY;
    var w = listW;
    var h = rowH;
    var p = 5;

    for (var i = 0; i < maxRows; i++) {

        var ID = list[i + listStep[0]];

        gr.DrawString(ID[0], infoNameFont, RGB(160, 162, 164), x + p, y + i * h, ID[2], h, StringFormat(0, 1, 3, 0x00002000));
        gr.DrawString(ID[1], infoValueFont, panelsNormalTextColor, x + p + ID[2], y + i * h, w - ID[2] - x, h, StringFormat(0, 1, 3, 0x00002000));

        var lY = (y + h) + i * h;
        gr.DrawLine(x, lY, x + w, lY, 1, lineColorNormal);

    }

    needsScrollbar && drawScrollbar(gr);

}
//===============================//

function listOnSize() {

    list = [];
    var meta = [];
    var info = [];
    listLength = 0;

    var metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (!metadb) return;

    var fileInfo = metadb.GetFileInfo();
    var metaCount = fileInfo.MetaCount;
    var infoCount = fileInfo.InfoCount;

    var metaValue;
    var infoName;
    var infoValue;
    var inf;
    var img = gdi.CreateImage(1, 1);
    var g = img.GetGraphics();

    for (var i = 0; i < fileInfo.MetaCount; i++) {

        var metaName = fileInfo.MetaName(i);

        if (metaName == "title" && (fb.IsPlaying && metadb.RawPath.indexOf("http://") == 0))
            inf = fb.TitleFormat("%title%").Eval();
        else inf = fileInfo.MetaValue(fileInfo.MetaFind(metaName), 0);

        meta[i] = [((metaName == "www") ? metaName : metaName.toLowerCase().capitalize() + ":")];

        meta[i][1] = inf;
        meta[i][2] = Math.ceil(g.MeasureString(meta[i][0], infoNameFont, 0, 0, 0, 0).Width) + 5;
    }

    for (var i = 0; i < fileInfo.InfoCount; i++) {

        var infoName = fileInfo.InfoName(i);

        info[i] = [infoName.toLowerCase().capitalize() + ":"];
        info[i][1] = fileInfo.InfoValue(fileInfo.InfoFind(infoName));
        info[i][2] = Math.ceil(g.MeasureString(info[i][0], infoNameFont, 0, 0, 0, 0).Width) + 5;

    }

    list = list.concat(meta, info);

    listLength = list.length;

    img.ReleaseGraphics(g);
    img.Dispose();

    listX = listLeft;
    listY = listTop;
    listH = Math.max(0, window.Height - listY - listBottom);
    listW = Math.max(100, window.Width - listX - listRight);

    maxRows = Math.max(0, Math.min(listLength, Math.floor(listH / rowH)));

    if (listStep[activeList] + maxRows > listLength && listLength >= maxRows) {
        listStep[activeList] += listLength - (listStep[activeList] + maxRows);
        window.SetProperty("system.Playlist Step", listStep[activeList].toString());
    }

    needsScrollbar = listLength > maxRows;

    if (needsScrollbar && showScrollbar) {
        listW = listW - scrollbarWidth - scrollbarRight;
    }

    //---> Scrollbar

    scrollbarX = window.Width - scrollbarWidth - scrollbarRight;
    scrollbarY = listTop;
    scrollbarBottom = listBottom;
    scrollbarHeight = window.Height - scrollbarY - scrollbarBottom;

    //---> 

    if (needsScrollbar) {
        createScrollbarThumbImages();
        refreshScrollbar()
    }

}
// =================================================== //

function on_playlist_items_selection_change() {
    if (fb.IsPlaying) return;
    refresh();
}
// =================================================== //

function on_playlists_changed() {
    if (fb.IsPlaying) return;
    refresh();
}
// =================================================== //

function on_playlist_switch() {
    if (fb.IsPlaying) return;
    refresh();
}
// =================================================== //

function on_playlist_items_added() {
    refresh();
}
// =================================================== //

function on_playlist_items_removed() {
    refresh();
}
// =================================================== //

function on_playback_new_track(metadb) {
    refresh();
}
// =================================================== //

function on_metadb_changed(handles, fromhook) {
    refresh();
}
// =================================================== //

function on_playback_stop(reason) {
    if (reason == 2) return;
    refresh();
}
// =================================================== //

function on_mouse_move(x, y, m) {
    scrollbarMouseEventHandler(x, y);
}
// =================================================== //

function on_mouse_lbtn_down(x, y, m) {
    scrollbarMouseEventHandler(x, y);
}
// =================================================== //

function on_playback_dynamic_info_track() {
    refresh();
}
// =================================================== //

function on_mouse_lbtn_dblclk(x, y, m) {
    scrollbarMouseEventHandler(x, y);
}
// =================================================== //

function on_mouse_lbtn_up(x, y, m) {
    scrollbarMouseEventHandler(x, y);
}
// =================================================== //

function on_mouse_wheel(delta) {
    scrollbarMouseEventHandler(delta);
}
// =================================================== //

function on_mouse_leave() {
    scrollbarMouseEventHandler(0, 0);
}
// =================================================== //

function on_key_down(vkey) {

    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

    if (CtrlKeyPressed && vkey == VK_KEY_P) {
        fb.RunMainMenuCommand("File/Preferences");
    }
}
// =================================================== //

function on_mouse_rbtn_up(x, y) {

    if (mouseInScrollbar) {
        scrollbarMouseEventHandler(x, y);
        return true;
    }

    var appear = window.CreatePopupMenu();
    var cpm = window.CreatePopupMenu();

    cpm.AppendMenuItem(fb.IsPlaying ? MF_STRING : MF_GRAYED, 1, "Properties...");
    appear.AppendMenuItem(MF_STRING, 2, "Show scrollbar");
    appear.CheckMenuItem(2, showScrollbar);
    if (showScrollbar && windowsVisualStyleEnabled) {
        appear.AppendMenuItem(MF_STRING, 3, "Scrollbar use windows style");
        appear.CheckMenuItem(3, scrollbarUseWindowsVisualStyle);
    }
    appear.AppendTo(cpm, MF_STRING | MF_POPUP, "Appearance");

    if (utils.IsKeyPressed(VK_SHIFT)) {
        cpm.AppendMenuSeparator();
        cpm.AppendMenuItem(MF_STRING, 12, "Console");
        cpm.AppendMenuItem(MF_STRING, 13, "Restart");
        cpm.AppendMenuItem(MF_STRING, 14, "Preferences...");
        cpm.AppendMenuSeparator();
        cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 15, "Configure script...");
        cpm.AppendMenuItem(MF_STRING, 16, "Configure...");
        cpm.AppendMenuItem(MF_STRING, 17, "Properties...");
    }

    var id = cpm.TrackPopupMenu(x, y);
    switch (id) {

    case 1:
        fb.RunContextCommand("Properties");
        break;
    case 2:
        showScrollbar = !showScrollbar;
        window.SetProperty("user.Show Scrollbar", showScrollbar);
        on_size();
        window.Repaint();
        break;
    case 3:
        scrollbarUseWindowsVisualStyle = !scrollbarUseWindowsVisualStyle;
        window.SetProperty("user.Scrollbar Use Windows Visual Style", scrollbarUseWindowsVisualStyle);
        refreshScrollbarStyle();
        break;
    case 12:
        fb.ShowConsole();
        break;
    case 13:
        fb.RunMainMenuCommand("File/Restart");
        break;
    case 14:
        fb.RunMainMenuCommand("File/Preferences");
        break;
    case 15:
        try {

            WshShell.Run("notepad.exe themes\\" + themeName + "\\Scripts\\Panel_Info.js");

        } catch (e) {
            fb.trace(e)
        };
        break;
    case 16:
        window.ShowConfigure();
        break;
    case 17:
        window.ShowProperties();
        break;

    }

    cpm.Dispose();
    return true;
}
// =================================================== //

function on_size() {

    ww = window.Width;
    wh = window.Height;

    listOnSize();

}
// =================================================== //

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
// =================================================== //

function repaintList() {
    var ex = 10;
    listW && window.RepaintRect(listX - ex, listY - ex, listW + ex * 2, listH + ex * 2);
}
// =================================================== //

function refresh() {

    listOnSize();
    window.Repaint();

}