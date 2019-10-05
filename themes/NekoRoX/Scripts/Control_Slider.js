// ====================================== //
// @name "Slider Control (24.05.2013)"
// @author "eXtremeHunter"
// ====================================== //
var slider = [];
var volbarPos = seekbarPos = 0;
var oldSlider, tempVolCurrent, tempVolOnClick, tempVolOnMove, thisSlider, thisSliderID, downSlider, tempX;
var volWithWheel = mouseInControl = mouseInPanel = false;
var showTooltip = window.GetProperty("Show Slider Tooltip", false);
var showTimeRemaining = window.GetProperty("Show Time Remaining", true);
// ================================== //

function pos2vol(p) {
    return (50 * Math.log(0.99 * p + 0.01) / Math.log(10));
}
// ================================== //

function vol2pos(v) {
    return (((Math.pow(10, v / 50) - 0.01) / 0.99));
}
// ================================== //
var tooltip = window.CreateTooltip();
var tooltipTrackingActive = false;
// ================================== //

function sliderEventHandler(x, y, m) {

    var c = caller();

    if (x != undefined && y != undefined) {

        if (!mouseInPanel) mouseInPanel = true;

        thisSlider = undefined;
        thisSliderID = undefined;
        mouseInControl = false;

        for (var i in slider) {

            if (slider[i].mouseInThis(x, y)) {
                mouseInControl = true;
                thisSlider = slider[i];
                thisSliderID = i;
            }

        }

    }

    switch (c) {

    case "on_mouse_move":

        if (!downSlider) {

            if (oldSlider && oldSlider != thisSlider) {
                oldSlider.changeState(0);
            }

            if (thisSlider && thisSlider != oldSlider) {
                thisSlider.changeState(1);
            }

            oldSlider = thisSlider;

        } else if (oldSlider && oldSlider != thisSlider) {

            mouseInControl = false;

        }

        if (tempX != x && downSlider) {

            if (downSlider == slider["seekbar"] && fb.IsPlaying) {

                var playbackLength = fb.PlaybackLength;
                seekbarPos = Math.round(Math.max(0, Math.min(seekbarW, seekbarW * (x / seekbarW) - seekbarX)));
                seekbarTime1 = timeFormat(Math.max(0, Math.min(playbackLength, playbackLength * (x - seekbarX) / seekbarW)));
                seekbarTime2 = timeFormat(Math.max(0, Math.min(playbackLength, playbackLength * ((seekbarX - x) / seekbarW) + playbackLength)));
                if (seekbarTime2 != "0:00")
                    seekbarTime2 = "-" + seekbarTime2;
                else seekbarTime2 = " " + seekbarTime2;

                downSlider.tooltip();
                downSlider.repaint();

            }

            if (downSlider == slider["volbar"]) {

                fb.Volume = pos2vol(Math.max(0, Math.min(volbarW, x - volbarX)) / volbarW);

                if (tempVolCurrent) tempVolOnMove = fb.Volume;

            }
        }

        tempX = x;

        break;

    case ("on_mouse_lbtn_down"):

        if (thisSlider && thisSlider.state != 2) {

            thisSlider.changeState(2);
            downSlider = thisSlider;

            if (thisSliderID == "seekbar" && fb.IsPlaying) {

                seekbarPos = Math.round(Math.max(0, Math.min(seekbarW, seekbarW * (x / seekbarW) - seekbarX)));
                seekbarTime1 = timeFormat(fb.PlaybackLength * (x - seekbarX) / seekbarW);
                seekbarTime2 = "-" + timeFormat(fb.PlaybackLength * ((seekbarX - x) / seekbarW) + fb.PlaybackLength);
                thisSlider.tooltip();
                thisSlider.repaint();

            }

            if (thisSliderID == "volbar") {

                tempVolCurrent = fb.Volume;
                fb.Volume = pos2vol(Math.max(0, Math.min(volbarW, x - volbarX)) / volbarW);
                tempVolOnClick = fb.Volume;
            }

        }

        break;

    case "on_mouse_lbtn_up":

        if (oldSlider) {
            oldSlider.changeState(0);
            oldSlider = undefined;
        }
        if (thisSlider) thisSlider.changeState(1);

        if (downSlider == slider["seekbar"] && fb.IsPlaying && (y > seekbarY)) {

            fb.PlaybackTime = Math.max(0, Math.min(fb.PlaybackLength, fb.PlaybackLength * (x - seekbarX) / seekbarW));

        }

        if (downSlider == slider["volbar"]) {

            if (y < volbarY) {

                fb.Volume = tempVolCurrent;

            } else if (tempVolCurrent != undefined && volWithWheel) {

                fb.Volume = tempVolOnMove ? fb.Volume = tempVolOnMove : fb.Volume = tempVolOnClick;

            }

            tempVolCurrent = tempVolOnClick = tempVolOnMove = volWithWheel = undefined;

        }

        downSlider = undefined;

        break;

    case ("on_mouse_lbtn_dblclk"):

        if (thisSlider) {
            thisSlider.changeState(2);
        }

        break;

    case ("on_mouse_wheel"):

        if (!mouseInPanel) return;

        if (tempX > slider["volbar"].x) {
            var currentPos = vol2pos(fb.Volume) * volbarW;
            currentPos += x * volbarW / (utils.IsKeyPressed(17) ? 100 : 20);
            fb.Volume = pos2vol(Math.max(0, Math.min(volbarW, Math.round(currentPos))) / volbarW);

            if (tempVolCurrent != undefined) volWithWheel = true;

        } else if (tempX < (slider["seekbar"].x + slider["seekbar"].w + seekbarTextW)) {

            fb.PlaybackTime += (utils.IsKeyPressed(17) ? x : x * 10);
            slider["seekbar"].repaint();

        }

        break;

    case ("on_mouse_leave"):

        for (var i in slider) {

            var thisSlider = slider[i];

            if (thisSlider.state != 0) {
                thisSlider.changeState(0);
                thisSlider.repaint();
            }

        }

        thisSliderID = oldSlider = undefined;
        mouseInPanel = false;


        break;

    case ("on_volume_change"):

        volbarPercent = Math.round(vol2pos(x) * 100);
        volbarPos = Math.round(vol2pos(x) * volbarW);
        slider["volbar"].repaint();
        slider["volbar"].tooltip();

        break;

    case ("on_playback_new_track"):

        slider["seekbar"].repaint();
        startSeekbarTimer();

        break;

    }

}
// ====================================== //
var seekbarTimer;
var seekbarTimerStarted = false;

function startSeekbarTimer() {

    if (seekbarTimerStarted) return;

    seekbarTimer = window.SetInterval(function () {

        if (downSlider != slider["seekbar"]) {

            slider["seekbar"].tooltip();
            slider["seekbar"].repaint();

        }

    }, 100);

    seekbarTimerStarted = true;

}
(fb.IsPlaying && !fb.IsPaused) && startSeekbarTimer();
// ====================================== //

function stopSeekbarTimer() {

    if (!fb.IsPaused) {

        seekbarPos = 0;
        seekbarTime1 = "0:00";
        slider["seekbar"].repaint();

    }

    if (seekbarTimerStarted) {

        window.ClearInterval(seekbarTimer);
        seekbarTimerStarted = false;
        slider["seekbar"].repaint();

    }

}
// ====================================== //

function Slider(x, y, w, h, id) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.state = 0;

}
// ====================================== //
Slider.prototype.mouseInThis = function (x, y) {

    return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);

}
// ====================================== //
Slider.prototype.repaint = function () {

    window.RepaintRect(this.x - seekbarTextW, this.y, this.w + seekbarTextW * 2, this.h);

}
// ====================================== //
Slider.prototype.changeState = function (state) {

    this.state = state;
    //this.state == 0 ? window.SetCursor(IDC_ARROW) : window.SetCursor(IDC_HAND);
    if (this.state != 0) {

        if (!tooltipTrackingActive) {

            if (!showTooltip) return;

            if (this.id == "seekbar") {

                tooltip.Activate();
                tooltip.TrackActivate = true;
                tooltipTrackingActive = true;
                this.tooltip();

            }

            if (this.id == "volbar") {

                tooltip.Activate();
                tooltip.TrackActivate = true;
                tooltipTrackingActive = true;
                this.tooltip();

            }
        }

    } else if (tooltipTrackingActive) {

        tooltip.TrackActivate = false;
        tooltipTrackingActive = false;

    }
}
// ====================================== //
Slider.prototype.tooltip = function () {

    if (!showTooltip || !this.state) return;

    if (this.id == "seekbar") {
        tooltip.Text = Math.floor(seekbarPos / this.w * 100) + "%";
        tooltip.TrackPosition(this.x + seekbarPos - 18, this.y - this.h - 5);
    }

    if (this.id == "volbar") {
        tooltip.Text = Math.round(vol2pos(fb.Volume) * 100) + "%";
        tooltip.TrackPosition(this.x + volbarPos - 18, this.y - this.h - 5);
    }

}
// ====================================== //

function createSeekbar(x, y, w, h, textWidth) {

    seekbarX = x;
    seekbarY = y;
    seekbarW = w;
    seekbarH = h;
    seekbarTextW = textWidth;
    slider["seekbar"] = new Slider(seekbarX, seekbarY, seekbarW, seekbarH, "seekbar");

}
// ====================================== //

function createVolbar(x, y, w, h, textWidth) {

    volbarX = x;
    volbarY = y;
    volbarW = w;
    volbarH = h;
    volbarTextW = textWidth;
    volbarPos = Math.round(vol2pos(fb.Volume) * volbarW);
    slider["volbar"] = new Slider(volbarX, volbarY, volbarW, volbarH, "volbar");

}
// ====================================== //