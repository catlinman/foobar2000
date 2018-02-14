// ====================================== //
// @name "Top Panel (22.10.2013)"
// @author "eXtremeHunter"
// ====================================== //
var FrameStyle = {
    Default: 0,
    SmallCaption: 1,
    NoCaption: 2,
    NoBorder: 3
}
var MoveStyle = {
    Default: 0,
    Middle: 1,
    Left: 2,
    Both: 3
}
var maximizeToFullScreen = window.GetProperty("Maximize To FullScreen", true);
var showLogo = window.GetProperty("Show foobar2000 logo", false);
var frameFocusShadow = window.GetProperty("Frame Focus Shadow", false);
var showFoobarVersion = window.GetProperty("Show Foobar Version", false);
var showRandomButton = window.GetProperty("Show Random Button", true);
var showBlaybackButtonNormalStateEllipse = window.GetProperty("Button Normal State Ellipse", false);
var showOpenExplorerButton = window.GetProperty("Show Open Explorer Button", true);
if (safeMode) {
    showOpenExplorerButton = false
}
var playbackButtonsLeft = window.GetProperty("Playback buttons -> left", false);
var fooLogo = gdi.Image(fb.FoobarPath + "themes\\CaTRoX\\Images\\fooLogo.png");
var barY = 28;
var streamMetadb;
var displayFont = gdi.font("Segoe Ui Semibold", 14, 0);
var captionColor = RGB(40, 40, 40);
var buttonCount = 0;
var buttonsRight = 0;
var buttonMargin = 0;
createButtonImages();

function on_paint(gr) {

    var metadb = (fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem());

    gr.SetTextRenderingHint(5);

    frameFocusShadow && gr.DrawLine(0, 0, ww, 0, 1, captionColor);

    var barHeight = wh - barY;
    var test = 0;

    !test && gr.FillSolidRect(4, 4, ww - 8, 24, captionColor);
    //---> Logo

    if (showLogo && fooLogo) {
        var logoX = (playbackButtonsLeft ? buttonsRight + buttonMargin : buttonMargin),
            logoW = 16,
            logoY = (barY + barHeight / 2) - logoW / 2;

        gr.SetInterpolationMode(InterpolationMode.HighQualityBicubic);
        gr.DrawImage(fooLogo, logoX, logoY, logoW, logoW, 0, 0, fooLogo.Width, fooLogo.Height, 0, 225);
    }

    //---> Info Display
    var textMargin = 10;

    if (metadb) {

        var fields = "[%tracknumber%. ][%title%] ['('%length%')'][  \u25AA  $if($greater($len(%artist%),1),%artist%,%album artist%)][  \u25AA  %album%]";

        var text = (fb.IsPlaying ? fb.TitleFormat(fields).Eval() : fb.TitleFormat(fields).EvalWithMetadb(metadb)),

            x = (playbackButtonsLeft ? ((showLogo && fooLogo) ? logoX + logoW + textMargin : buttonsRight + textMargin) : ((showLogo && fooLogo) ? logoX + logoW + textMargin : 15)),
            y = barY,
            w = (playbackButtonsLeft ? ww - x - textMargin : (ww - (ww - b[0].x) - x - textMargin)),
            h = barHeight,
            stringFormat = StringFormat(0, 1, 3, 4096); // LEFT | VCENTER | END_ELLIPSIS | NO_WRAP

        gr.DrawString(text, displayFont, RGB(170, 172, 174), x, y, w, h, stringFormat);

    }

    if (showFoobarVersion) {
        gr.DrawString(themeName + themeVersion + fb.TitleFormat("  \u25AA  %_foobar2000_version%").eval(true), gdi.font("Segoe Ui Semibold", 11, 0), RGBA(240, 242, 244, 120), 190, 5, ww - 190, 20, StringFormat(1, 1));
    }

    //---> Draw buttons
    for (var i in b) {

        var x = b[i].x,
            y = b[i].y,
            w = b[i].w,
            h = b[i].h,
            s = b[i].state,
            ha = b[i].hoverAlpha,
            da = b[i].downAlpha,
            img = b[i].img;

        gr.DrawImage(img[0], x, y, w, h, 0, 0, w, h, 0, 255); // normal
        gr.DrawImage(img[1], x, y, w, h, 0, 0, w, h, 0, b[i].hoverAlpha);
        gr.DrawImage(img[2], x, y, w, h, 0, 0, w, h, 0, b[i].downAlpha);

    }

}
// =================================================== //

function on_size() {

    ww = window.Width;
    wh = window.Height;

    createButtonObjects(ww, wh);

    if (!uiHacks) return;

    try { // needed when doble clicking on caption and UIHacks.FullScreen == true;
        if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState == 0) {
            UIHacks.MainWindowState = 0;
        }
    } catch (e) {};

}
// =================================================== //
var pseudoCaption;
var pseudoCaptionWidth;
var mouseInPanel = false;

function on_mouse_move(x, y, m) {

    if (!mouseInPanel) mouseInPanel = true;

    buttonEventHandler(x, y, m);

    if (!uiHacks) return;

    try {

        if (mouseInControl || downButton) {

            UIHacks.SetPseudoCaption(0, 0, 0, 0);
            if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = true;
            pseudoCaption = false;

        } else if (!pseudoCaption || pseudoCaptionWidth != ww) {

            UIHacks.SetPseudoCaption(5, 5, ww - 20, wh - 10);
            if (UIHacks.FrameStyle == 3) UIHacks.DisableSizing = false;
            pseudoCaption = true;
            pseudoCaptionWidth = ww;

        }

    } catch (e) {};

}
// =================================================== //

function on_mouse_lbtn_down(x, y, m) {

    buttonEventHandler(x, y, m);

}
// =================================================== //

function on_mouse_lbtn_dblclk(x, y, m) {

    buttonEventHandler(x, y, m);
    pseudoCaption = false;

}
// =================================================== //

function on_mouse_lbtn_up(x, y, m) {

    buttonEventHandler(x, y, m);

}
// =================================================== //

function on_mouse_wheel(delta) {

    if (mouseInPanel) {
        fb.Volume = fb.Volume + delta * Math.exp(-fb.Volume / 33.333);
    }

}
// =================================================== //

function on_mouse_leave() {

    buttonEventHandler(0, 0);

    if (uiHacks && UIHacks.FrameStyle == 3) UIHacks.DisableSizing = false;
    mouseInPanel = false;

}
// =================================================== //

function on_playback_stop(reason) {

    if (reason != 2) {
        refreshPlayButton();
    }
    window.Repaint();

}
// =================================================== //

function on_playback_pause(state) {

    refreshPlayButton();

}
// =================================================== //

function on_playback_starting(cmd, is_paused) {

    if (!fb.GetFocusItem()) return;
    refreshPlayButton();

}
// =================================================== //

function on_playback_new_track() {

    window.Repaint();

}
// =================================================== //

function on_playback_dynamic_info_track() {

    window.Repaint();

}
// =================================================== //

function on_playlist_items_added() {

    window.Repaint();

}
// =================================================== //

function on_playlist_items_removed(playlist, new_count) {

    if (!fb.IsPlaying && !new_count) {
        window.Repaint();
    }

}
// =================================================== //

function on_playlist_items_selection_change() {

    if (!fb.IsPlaying) {
        window.Repaint();
    }
}
// =================================================== //

function createButtonObjects(ww, wh) {

    b = [];

    //---> Playback buttons
    var add = 0;
    buttonCount = 4;
    if (showRandomButton) buttonCount++;
    if (showOpenExplorerButton) buttonCount++;

    var y = barY + 5;
    var w = 32;
    var h = w;
    var p = 5;
    var x = 0;
    buttonMargin = 10;
    if (playbackButtonsLeft) {
        x = buttonMargin;
    } else {
        x = ww - w * buttonCount - p * (buttonCount - 1) - buttonMargin;
    }
    buttonCount = 1;

    b[0] = new Button(x, y, w, h, "Stop", btnImg.Stop);
    b[1] = new Button(x + w + p, y, w, h, "Previous", btnImg.Previous);
    b[2] = new Button(x + (w + p) * ++buttonCount, y, w, h, "Play/Pause", (fb.IsPlaying ? (fb.IsPaused ? btnImg.Play : btnImg.Pause) : btnImg.Play));
    b[3] = new Button(x + (w + p) * ++buttonCount, y, w, h, "Next", btnImg.Next);
    if (showRandomButton) {
        b[4] = new Button(x + (w + p) * ++buttonCount, y, w, h, "Playback/Random", btnImg.PlaybackRandom);
    }
    if (showOpenExplorerButton) {
        b[5] = new Button(x + (w + p) * ++buttonCount, y, w, h, "OpenExplorer", btnImg.OpenExplorer);
    }
    buttonsRight = x + (w + p) * buttonCount + w;

    //---> Caption buttons   
    if (uiHacks && UIHacks.FrameStyle) {

        (UIHacks.FrameStyle == FrameStyle.SmallCaption && UIHacks.FullScreen != true) ? hideClose = true : hideClose = false;

        var y = 5;
        var w = 22;
        var h = w;
        var p = 3;
        var x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - 8;

        b[10] = new Button(x, y, w, h, "Minimize", btnImg.Minimize);
        b[11] = new Button(x + w + p, y, w, h, "Maximize", btnImg.Maximize);
        if (!hideClose)
            b[12] = new Button(x + (w + p) * 2, y, w, h, "Close", btnImg.Close);

    }
    //---> Menu buttons

    var img = btnImg.File;
    var x = 5;
    var y = 5;
    var h = img[0].Height;
    var w = img[0].Width;
    var p = 0;

    b[20] = new Button(x, y, w, h, "File", img);
    var img = btnImg.Edit;
    var x = x + w;
    var w = img[0].Width;
    b[21] = new Button(x, y, w, h, "Edit", img);
    var img = btnImg.View;
    var x = x + w;
    var w = img[0].Width;
    b[22] = new Button(x, y, w, h, "View", img);
    var img = btnImg.Playback;
    var x = x + w;
    var w = img[0].Width;
    b[23] = new Button(x, y, w, h, "Playback", img);
    var img = btnImg.Library;
    var x = x + w;
    var w = img[0].Width;
    b[24] = new Button(x, y, w, h, "Library", img);
    var img = btnImg.Help;
    var x = x + w;
    var w = img[0].Width;
    b[25] = new Button(x, y, w, h, "Help", img);
    var img = btnImg.Playlists;
    var x = x + w;
    var w = img[0].Width;
    b[26] = new Button(x, y, w, h, "Playlists", img);

}
// =================================================== //

function createButtonImages() {

    var fontGuifx = gdi.font("Guifx v2 Transports", 16, 0);
    var fontMarlett = gdi.font("Marlett", 13, 0);
    var fontSegoeUi = gdi.font("Segoe Ui Semibold", 12, 0);

    var btn = {

        Stop: {
            ico: Guifx.Stop,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        Previous: {
            ico: Guifx.Previous,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        Play: {
            ico: Guifx.Play,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        Pause: {
            ico: Guifx.Pause,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        Next: {
            ico: Guifx.Next,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        PlaybackRandom: {
            ico: Guifx.SlowForward,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        OpenExplorer: {
            ico: Guifx.Eject,
            font: fontGuifx,
            id: "playback",
            w: 30,
            h: 30
        },
        Minimize: {
            ico: "0",
            font: fontMarlett,
            id: "caption",
            w: 22,
            h: 22
        },
        Maximize: {
            ico: "1",
            font: fontMarlett,
            id: "caption",
            w: 22,
            h: 22
        },
        Close: {
            ico: "r",
            font: fontMarlett,
            id: "caption",
            w: 22,
            h: 22
        },
        File: {
            ico: "File",
            font: fontSegoeUi,
            id: "menu"
        },
        Edit: {
            ico: "Edit",
            font: fontSegoeUi,
            id: "menu"
        },
        View: {
            ico: "View",
            font: fontSegoeUi,
            id: "menu"
        },
        Playback: {
            ico: "Playback",
            font: fontSegoeUi,
            id: "menu"
        },
        Library: {
            ico: "Library",
            font: fontSegoeUi,
            id: "menu"
        },
        Help: {
            ico: "Help",
            font: fontSegoeUi,
            id: "menu"
        },
        Playlists: {
            ico: "Playlists",
            font: fontSegoeUi,
            id: "menu"
        }

    };

    btnImg = [];

    for (var i in btn) {

        if (btn[i].id == "menu") {
            var img = gdi.CreateImage(100, 100);
            g = img.GetGraphics();

            btn[i].w = Math.ceil(g.MeasureString(btn[i].ico, btn[i].font, 0, 0, 0, 0).Width) + 17;
            img.ReleaseGraphics(g);
            img.Dispose();
            btn[i].h = 21;
        }

        var w = btn[i].w,
            h = btn[i].h,
            lw = 2;

        var stateImages = []; //0=normal, 1=hover, 2=down;

        for (var s = 0; s <= 2; s++) {

            var img = gdi.CreateImage(w, h);
            g = img.GetGraphics();
            g.SetSmoothingMode(2);
            g.SetTextRenderingHint(5);

            var menuTextColor = RGB(140, 142, 144);
            var menuRectColor = RGB(120, 122, 124);
            var captionIcoColor = RGB(140, 142, 144);
            var playbackIcoColor = RGB(150, 152, 154);
            var playbackEllypseColor = RGBA(70, 70, 70, (showBlaybackButtonNormalStateEllipse ? 255 : 0));

            if (s == 1) {
                menuTextColor = RGB(180, 182, 184);
                menuRectColor = RGB(170, 172, 174);
                captionIcoColor = RGB(190, 192, 194);
                playbackIcoColor = RGB(190, 192, 194);
                playbackEllypseColor = RGB(190, 195, 200);

            } else if (s == 2) {
                menuTextColor = RGB(120, 122, 124);
                menuRectColor = RGB(110, 112, 114);
                captionIcoColor = RGB(100, 102, 104);
                playbackIcoColor = RGB(90, 90, 90);
                playbackEllypseColor = RGB(80, 80, 80);

            }

            //---> 
            if (btn[i].id == "menu") {
                g.FillSolidRect(0, 0, w, h, captionColor);
                s && g.DrawRect(Math.floor(lw / 2) + 0, Math.floor(lw / 2) + 0, w - lw, h - lw, 1, menuRectColor);
                g.DrawString(btn[i].ico, btn[i].font, menuTextColor, 0, 0, w, h - 1, StringFormat(1, 1));
            } else if (btn[i].id == "caption") {
                g.DrawString(btn[i].ico, btn[i].font, captionIcoColor, 0, 0, w, h, StringFormat(1, 1));
            } else if (btn[i].id == "playback") {
                g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, playbackEllypseColor);
                g.DrawString(btn[i].ico, btn[i].font, playbackIcoColor, (i == "Stop" || i == "OpenExplorer") ? 0 : 1, 0, w, h, StringFormat(1, 1));
            }
            //--->     

            img.ReleaseGraphics(g);
            stateImages[s] = img;

        }

        btnImg[i] = stateImages;

    }

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

    var windowsVisualStyleEnabled = window.CreateThemeManager("WINDOW");

    var cpm = window.CreatePopupMenu();
    var frame = window.CreatePopupMenu();

    if (uiHacks) {
        frame.AppendMenuItem(MF_STRING, 1, "Default");
        frame.AppendMenuItem(MF_STRING, 2, "Small caption");
        frame.AppendMenuItem(MF_STRING, 3, "No caption");
        frame.AppendMenuItem(MF_STRING, 4, "No border");
        frame.CheckMenuRadioItem(1, 4, UIHacks.FrameStyle + 1);
        if (UIHacks.FrameStyle == FrameStyle.NoBorder && UIHacks.Aero.Active) {
            frame.AppendMenuItem(MF_STRING, 5, "Frame focus shadow");
            frame.CheckMenuItem(5, (UIHacks.Aero.Left + UIHacks.Aero.Top + UIHacks.Aero.Right + UIHacks.Aero.Bottom));
        }
        frame.AppendTo(cpm, MF_STRING | MF_POPUP, "Frame style");


        if (UIHacks.FrameStyle > 0) {
            cpm.AppendMenuSeparator();
            cpm.AppendMenuItem(MF_STRING, 6, "Maximize button -> to fullscreen");
        }
        cpm.CheckMenuItem(6, maximizeToFullScreen);
        cpm.AppendMenuSeparator();
    }

    cpm.AppendMenuItem(MF_STRING, 7, "Show version");
    cpm.CheckMenuItem(7, showFoobarVersion);
    cpm.AppendMenuItem(MF_STRING, 8, "Show foobar2000 logo");
    cpm.CheckMenuItem(8, showLogo);
    cpm.AppendMenuItem(MF_STRING, 9, "Show random button");
    cpm.CheckMenuItem(9, showRandomButton);
    cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 10, "Show open explorer button");
    cpm.CheckMenuItem(10, showOpenExplorerButton);
    cpm.AppendMenuItem(MF_STRING, 11, playbackButtonsLeft ? "Playback buttons -> right" : "Playback buttons -> left");
    cpm.AppendMenuItem(MF_STRING, 12, showBlaybackButtonNormalStateEllipse ? "Hide playback button ellipse" : "Show playback button ellipse");

    if (utils.CheckComponent("foo_ui_hacks") && safeMode) cpm.AppendMenuItem(MF_STRING, 102, "Frame styles not available (disable WSH safe mode)");

    if (utils.IsKeyPressed(VK_SHIFT)) {
        cpm.AppendMenuItem(MF_STRING, 100, "Console");
        cpm.AppendMenuItem(MF_STRING, 101, "Restart");
        cpm.AppendMenuItem(MF_STRING, 102, "Preferences...");
        cpm.AppendMenuSeparator();
        cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 103, "Configure script...");
        cpm.AppendMenuItem(MF_STRING, 104, "Configure...");
    }
    cpm.AppendMenuItem(MF_STRING, 105, "Properties...");


    var id = cpm.TrackPopupMenu(x, y);

    switch (id) {

    case 1:
        UIHacks.FrameStyle = FrameStyle.Default;
        UIHacks.MoveStyle = MoveStyle.Default;
        UIHacks.Aero.Effect = 0;
        on_size();
        break;
    case 2:
        UIHacks.FrameStyle = FrameStyle.SmallCaption;
        UIHacks.MoveStyle = MoveStyle.Default;
        UIHacks.Aero.Effect = 0;
        on_size();
        break;
    case 3:
        UIHacks.FrameStyle = FrameStyle.NoCaption;
        UIHacks.MoveStyle = MoveStyle.Both;
        UIHacks.Aero.Effect = 0;
        on_size();
        break;
    case 4:
        UIHacks.FrameStyle = FrameStyle.NoBorder;
        UIHacks.MoveStyle = MoveStyle.Both;
        UIHacks.Aero.Effect = 2;
        on_size();
        break;
    case 5:
        frameFocusShadow = !frameFocusShadow;
        frameShadowSwitch(frameFocusShadow);
        window.SetProperty("Frame Focus Shadow", frameFocusShadow);
        break;
    case 6:
        maximizeToFullScreen = !maximizeToFullScreen;
        window.SetProperty("Maximize To FullScreen", maximizeToFullScreen);
        break;
    case 7:
        showFoobarVersion = !showFoobarVersion;
        window.SetProperty("Show Foobar Version", showFoobarVersion);
        window.Repaint();
        break;
    case 8:
        showLogo = !showLogo;
        window.SetProperty("Show foobar2000 logo", showLogo);
        window.Repaint();
        break;
    case 9:
        showRandomButton = !showRandomButton;
        window.SetProperty("Show Random Button", showRandomButton);
        on_size();
        window.Repaint();
        break;
    case 10:
        showOpenExplorerButton = !showOpenExplorerButton;
        window.SetProperty("Show Open Explorer Button", showOpenExplorerButton);
        on_size();
        window.Repaint();
        break;
    case 11:
        playbackButtonsLeft = !playbackButtonsLeft;
        window.SetProperty("Playback buttons -> left", playbackButtonsLeft);
        on_size();
        window.Repaint();
        break;
    case 12:
        showBlaybackButtonNormalStateEllipse = !showBlaybackButtonNormalStateEllipse;
        window.SetProperty("Button Normal State Ellipse", showBlaybackButtonNormalStateEllipse);
        createButtonImages();
        on_size();
        window.Repaint();
        break;
    case 100:
        fb.ShowConsole();
        break;
    case 101:
        fb.RunMainMenuCommand("File/Restart");
        break;
    case 102:
        fb.RunMainMenuCommand("File/Preferences");
        break;
    case 103:
        try {

            WshShell.Run("notepad.exe themes\\" + themeName + "\\Scripts\\Panel_Top.js");

        } catch (e) {
            fb.trace(e)
        };
        break;
    case 104:
        window.ShowConfigure();
        break;
    case 105:
        window.ShowProperties();
        break;
    }

    frame.Dispose();
    cpm.Dispose();
    return true;
}
// =================================================== //

(function frameShadowSwitch(frameFocusShadow) {

    if (!uiHacks) return;
    if (frameFocusShadow) {
        UIHacks.Aero.Effect = 2;
        UIHacks.Aero.Top = 1;
    } else {
        UIHacks.Aero.Effect = 0;
        UIHacks.Aero.Left = UIHacks.Aero.Top = UIHacks.Aero.Right = UIHacks.Aero.Bottom = 0;
    }

})(frameFocusShadow);
// =================================================== //

(function fontCheck() {

    var fonts = ["Segoe Ui", "Segoe Ui Semibold", "Segoe Ui Symbol", "Consolas", "Marlett", "Guifx v2 Transports"];
    var checkedFonts = "";
    var failCounter = 0;
    for (var i in fonts) {
        var check = utils.CheckFont(fonts[i]);
        if (!check) {
            failCounter++;
        }
        checkedFonts += ("\n" + fonts[i] + (check ? ": Installed." : ": NOT INSTALLED!"));
    }
    if (failCounter) {
        checkedFonts += "\n\nPlease install missing " + (failCounter > 1 ? "fonts" : "font") + " and restart foobar!";
        fb.ShowPopupMessage(checkedFonts, "Font Check");
    }

})();