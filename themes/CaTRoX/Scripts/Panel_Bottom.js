// ====================================== //
// @name "Bottom Panel (22.10.2013)"
// @author "eXtremeHunter"
// ====================================== //
var font = gdi.font("Consolas", 14, 1);
var SF = StringFormat(1, 1);

var posColor = RGB(110, 112, 114);
var sliderBackColor = RGB(37, 37, 37);
var b = [];

createButtonImages();

// ============================= //

function on_paint(gr) {

    gr.SetTextRenderingHint(5);
    var p = 5;
    // --- DRAW SEEKBAR --- //

    var x = seekbarX,
        y = seekbarY,
        w = seekbarW,
        h = seekbarH,
        bool = (fb.IsPlaying && fb.PlaybackTime),
        metadb = fb.GetFocusItem(),
        playbackTimeRemaining = bool ? fb.TitleFormat("[%playback_time_remaining%]").Eval() : "0:00", 
        timeRemaining = ((playbackTimeRemaining != "0:00" ? "-" : " ") + playbackTimeRemaining),
        isStream = (bool && (fb.GetNowPlaying().RawPath.indexOf("http://") == 0)),
        length = (fb.IsPlaying ? (!fb.PlaybackTime ? "0:00" : fb.TitleFormat("%length%").Eval()) : metadb && fb.TitleFormat("$if(%length%,%length%,0:00)").EvalWithMetadb(metadb)),
        sliderTextColor = (fb.IsPlaying ? RGB(130, 132, 134) : RGB(80, 80, 80));
        time2 = isStream ? "stream" : (showTimeRemaining && playbackTimeRemaining ? timeRemaining : " " + length);
    
    if (slider["seekbar"].state != 2 || isStream) {
        seekbarPos = ((bool && !isStream) ? Math.round(Math.max(0, Math.min(w, (w * (fb.PlaybackTime / fb.PlaybackLength))))) : 0);
        seekbarTime1 = (bool ? fb.TitleFormat("%playback_time%").Eval() : "0:00");
        seekbarTime2 = (fb.IsPlaying ? (fb.IsPlaying && seekbarTime1 == "0:00" ? "-" + fb.TitleFormat("%length%").Eval() : time2) : (metadb ? " " + length : " 0:00")); 
    }

    gr.FillSolidRect(x, y + p, w, h - p * 2, sliderBackColor);
    gr.FillSolidRect(x, y + p, seekbarPos, h - p * 2, posColor);
    gr.DrawString(seekbarTime1, font, sliderTextColor, x - seekbarTextW, y - 1, seekbarTextW, h, SF);
    gr.DrawString(seekbarTime2, font, sliderTextColor, x + w, y - 1, seekbarTextW, h, SF);

    // --- DRAW VOLBAR --- //

    var x = volbarX,
        y = volbarY,
        w = volbarW,
        h = volbarH,
        val = vol2pos(fb.Volume);
    if (val != 0) {
        volbarText = Math.round(val * 100) + "%";
        textColor = sliderTextColor;
    } else {
        volbarText = "MUTE";
        textColor = RGB(255, 50, 0);
    }
    gr.FillSolidRect(x, y + p, w, h - p * 2, sliderBackColor);
    gr.FillSolidRect(x, y + p, volbarPos, h - p * 2, posColor);
    //gr.DrawRect(x, y, w, h, 1, sliderFrameColor);
    //gr.DrawString(volbarText, font, textColor, x+w, y-1, volbarTextW, h, SF);
    //gr.DrawString(slider["volbar"].state, font, textColor, x, y, w, h, SF);

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

        //gr.DrawRect(x, y, w-1, h-1, 1, RGB(255,255,0));

    }

}
// ============================= //

function on_size() {

    ww = window.Width;
    wh = window.Height;

    var offset = 2;
    var sliderH = 14;
    var sliderY = Math.floor(wh / 2 - sliderH / 2) + offset;
    var textW = 70;
    var volW = 120;
    var volX = ww - volW - 35;
    var gap = 80;
    createSeekbar(textW, sliderY, volX - textW * 2 - gap, sliderH, textW);
    createVolbar(volX, sliderY, volW, sliderH, textW);

    //---> Buttons


    var w = btnImg.Repeat[0].Width;
    var y = Math.floor(wh / 2 - w / 2) + offset - 1;
    var h = w;
    var p = 9;
    var x = volX - gap + 2;

    if (fb.PlaybackOrder == playbackOrder.RepeatPlaylist) img = btnImg.RepeatPlaylist;
    else if (fb.PlaybackOrder == playbackOrder.RepeatTrack) img = btnImg.Repeat1;
    else img = btnImg.Repeat;

    b[0] = new Button(x, y, w, h, "Repeat", img);
    b[1] = new Button(x + w + p, y, btnImg.Shuffle[0].Width, h, "Shuffle", (fb.PlaybackOrder == playbackOrder.ShuffleTracks) ? btnImg.ShuffleTracks : btnImg.Shuffle);
    b[2] = new Button(ww - 30, y, w, h, "Mute", fb.Volume == -100 ? btnImg.Muted : btnImg.Mute);

}
// ================================== //
// ########## MOUSE EVENTS ########## // 
// ================================== //

// ============================= //

function on_mouse_wheel(step) {

    sliderEventHandler(step);

}
// ============================= //

function on_mouse_move(x, y, m) {

    buttonEventHandler(x, y, m);

    try {
        if (UIHacks.FrameStyle == 3 && !UIHacks.DisableSizing) {

            UIHacks.DisableSizing = true;
            //print("DisableSizing");
        }
    } catch (e) {};

    sliderEventHandler(x, y, m);


}
// ============================= //

function on_mouse_lbtn_down(x, y, m) {

    buttonEventHandler(x, y, m);
    sliderEventHandler(x, y, m);

}
// ============================= //

function on_mouse_lbtn_dblclk(x, y, m) {

    buttonEventHandler(x, y, m);
    sliderEventHandler(x, y, m);

}
// ============================= //

function on_mouse_lbtn_up(x, y, m) {

    buttonEventHandler(x, y, m);
    sliderEventHandler(x, y, m);

}
// ============================= //

function on_mouse_leave() {

    buttonEventHandler(0, 0, 0);
    sliderEventHandler(0, 0, 0);

    try {

        if (UIHacks.FrameStyle == 3 && UIHacks.DisableSizing) {

            UIHacks.DisableSizing = false;
            //print("EnableSizing");

        }

    } catch (e) {};

}
// ============================= //

function on_playback_starting(cmd, is_paused) {
    if (!is_paused) startSeekbarTimer();
}
// ============================= //

function on_playback_pause(state) {

    if (!state) startSeekbarTimer();

}
// ============================= //

function on_playback_stop(reason) {
    if (reason != 2) {
        stopSeekbarTimer();
    }
}
// ============================= //

function on_playback_new_track() {
    sliderEventHandler();
}
// ============================= //

function on_playlist_items_added() {

    window.Repaint();

}
// ============================= //

function on_playlist_items_removed(playlist, new_count) {

    if (!fb.IsPlaying && !new_count) {
        window.Repaint();
    }

}
// ============================= //

function on_playlist_items_selection_change() {

    if (!fb.IsPlaying) {
        window.Repaint();
    }
}
// ============================= //

function on_volume_change(val) {

    sliderEventHandler(val);

    if (val == -100) {

        b[2].img = btnImg.Muted;
        b[2].repaint();

    } else if (b[2].img == btnImg.Muted) {

        b[2].img = btnImg.Mute;
        b[2].repaint();

    }

}
// ============================= //

function on_playback_order_changed(id) {

    for (var i in playbackOrder) {

        if (id == playbackOrder[i]) {

            break;

        }

    }
    if (id == playbackOrder.RepeatPlaylist) b[0].img = btnImg.RepeatPlaylist;
    else if (id == playbackOrder.RepeatTrack) b[0].img = btnImg.Repeat1;
    else b[0].img = btnImg.Repeat;

    if (id == playbackOrder.ShuffleTracks) b[1].img = btnImg.ShuffleTracks;
    else b[1].img = btnImg.Shuffle;

    b[0].repaint();
    b[1].repaint();

}
// ============================= //

function createButtonImages() {

    var fontGuifx = gdi.font("Guifx v2 Transports", 18, 0);
    var fontMarlett = gdi.font("Marlett", 13, 0);
    var fontSegoeUi = gdi.font("Segoe Ui", 12, 0);
    var c = [250, 250, 250];
    var btn = {

        Repeat: {
            ico: Guifx.Repeat,
            font: fontGuifx,
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(c[0], c[1], c[2], 35),
            cHover: RGBA(c[0], c[1], c[2], 155),
            cDown: RGBA(c[0], c[1], c[2], 105)
        },
        Repeat1: {
            ico: Guifx.Repeat1,
            font: fontGuifx,
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(255, 165, 0, 155),
            cHover: RGBA(255, 165, 0, 225),
            cDown: RGBA(255, 165, 0, 105)
        },
        RepeatPlaylist: {
            ico: Guifx.Repeat,
            font: fontGuifx,
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(255, 165, 0, 155),
            cHover: RGBA(255, 165, 0, 225),
            cDown: RGBA(255, 165, 0, 105)
        },
        Shuffle: {
            ico: Guifx.Shuffle,
            font: fontGuifx,
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(c[0], c[1], c[2], 35),
            cHover: RGBA(c[0], c[1], c[2], 155),
            cDown: RGBA(c[0], c[1], c[2], 105)
        },
        ShuffleTracks: {
            ico: Guifx.Shuffle,
            font: fontGuifx,
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(255, 165, 0, 155),
            cHover: RGBA(255, 165, 0, 225),
            cDown: RGBA(255, 165, 0, 105)
        },
        Mute: {
            ico: Guifx.Mute2,
            font: gdi.font("Guifx v2 Transports", 22, 0),
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(c[0], c[1], c[2], 35),
            cHover: RGBA(c[0], c[1], c[2], 155),
            cDown: RGBA(c[0], c[1], c[2], 105)
        },
        Muted: {
            ico: Guifx.Mute2,
            font: gdi.font("Guifx v2 Transports", 22, 0),
            id: "playback",
            w: 24,
            h: 24,
            cNormal: RGBA(255, 165, 0, 155),
            cHover: RGBA(255, 165, 0, 225),
            cDown: RGBA(255, 165, 0, 105)
        }

    };

    btnImg = [];

    for (var i in btn) {

        var w = btn[i].w,
            h = btn[i].h,
            lw = 2;

        var stateImages = []; //0=normal, 1=hover, 2=down;

        for (var s = 0; s <= 2; s++) {

            color = btn[i].cNormal;

            if (s == 1) {
                color = btn[i].cHover;
            } else if (s == 2) {
                color = btn[i].cDown;
            }

            var img = gdi.CreateImage(w, h);
            g = img.GetGraphics();
            g.SetSmoothingMode(2);
            g.SetTextRenderingHint(5);

            //---> 
            g.FillSolidRect(0, 0, w, h, RGB(25, 25, 25));
            g.DrawString(btn[i].ico, btn[i].font, color, 0, 0, w, h, StringFormat(1, 1));
            //g.DrawEllipse(Math.floor(lw / 2) + 1, Math.floor(lw / 2) + 1, w - lw - 2, h - lw - 2, lw, color);

            //--->     

            img.ReleaseGraphics(g);
            stateImages[s] = img;

        }

        btnImg[i] = stateImages;

    }

}
// ============================= //

function on_key_down(vkey) {

    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

    if (CtrlKeyPressed && vkey == VK_KEY_P) {
        fb.RunMainMenuCommand("File/Preferences");
    }
}
// ============================= //

function on_mouse_rbtn_up(x, y) {

    var cpm = window.CreatePopupMenu();

    cpm.AppendMenuItem(MF_STRING, 1, "Show slider tooltip");
    cpm.CheckMenuItem(1, showTooltip);
    cpm.AppendMenuItem(MF_STRING, 2, "Show time remaining");
    cpm.CheckMenuItem(2, showTimeRemaining);
    cpm.AppendMenuSeparator();
    cpm.AppendMenuItem(MF_STRING, 10, "Console");
    cpm.AppendMenuItem(MF_STRING, 11, "Restart");
    cpm.AppendMenuItem(MF_STRING, 12, "Preferences...");
    if (utils.IsKeyPressed(VK_SHIFT)) {
        cpm.AppendMenuSeparator();
        cpm.AppendMenuItem(safeMode ? MF_GRAYED : MF_STRING, 13, "Configure script...");
        cpm.AppendMenuItem(MF_STRING, 14, "Configure...");
        cpm.AppendMenuItem(MF_STRING, 15, "Properties...");
    }

    var id = cpm.TrackPopupMenu(x, y);
    switch (id) {

    case 1:
        showTooltip = !showTooltip;
        window.SetProperty("Show Slider Tooltip", showTooltip);
        break;
    case 2:
        showTimeRemaining = !showTimeRemaining;
        window.SetProperty("Show Time Remaining", showTimeRemaining);
        window.Repaint();
        break;
    case 10:
        fb.ShowConsole();
        break;
    case 11:
        fb.RunMainMenuCommand("File/Restart");
        break;
    case 12:
        fb.RunMainMenuCommand("File/Preferences");
        break;
    case 13:
        try {

            WshShell.Run("notepad.exe themes\\" + themeName + "\\Scripts\\Panel_Bottom.js");

        } catch (e) {
            fb.trace(e)
        };
        break;
    case 14:
        window.ShowConfigure();
        break;
    case 15:
        window.ShowProperties();
        break;


    }

    cpm.Dispose();
    return true;
}