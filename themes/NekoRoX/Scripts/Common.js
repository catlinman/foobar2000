// ==PREPROCESSOR==
// @name 'Common'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

//<editor-fold desc="Global constants">

var g_theme = {};
g_theme.name = 'NekoRoX';
g_theme.version = '';
g_theme.folder_name = 'NekoRoX';
g_theme.script_folder = 'themes\\' + g_theme.folder_name + '\\Scripts\\';

g_theme.colors = {};
g_theme.colors.pss_back = _.RGB(12, 12, 12);
g_theme.colors.panel_back = _.RGB(15, 15, 15);
g_theme.colors.panel_front = _.RGB(30, 30, 30);
g_theme.colors.panel_line = _.RGB(55, 55, 55);
g_theme.colors.panel_line_selected = g_theme.colors.panel_line;
g_theme.colors.panel_text_normal = _.RGB(128, 128, 128);

/** @enum{number} */
var g_font_style = {
    regular:     0,
    bold:        1,
    italic:      2,
    bold_italic: 3,
    underline:   4,
    strikeout:   8
};

/** @enum{number} */
var g_playback_order = {
    default:         0,
    repeat_playlist: 1,
    repeat_track:    2,
    random:          3,
    shuffle_tracks:  4,
    shuffle_albums:  5,
    shuffle_folders: 6
};

/** @enum{string|number} */
var g_guifx = {
    name:          'Guifx v2 Transports',
    play:          1,
    pause:         2,
    stop:          3,
    record:        4,
    rewind:        5,
    fast_forward:  6,
    previous:      7,
    next:          8,
    replay:        9,
    refresh:       0,
    mute:          '!',
    mute2:         '@',
    volume_down:   '#',
    volume_up:     '$',
    thumbs_down:   '%',
    thumbs_up:     '^',
    shuffle:       '\&',
    repeat:        '*',
    repeat1:       '(',
    zoom:          ')',
    zoom_out:      '_',
    zoom_in:       '+',
    minus:         '-',
    plus:          '=',
    up:            'W',
    down:          'S',
    left:          'A',
    right:         'D',
    up2:           'w',
    down2:         's',
    left2:         'a',
    right2:        'd',
    start:         '{',
    end:           '}',
    top:           '?',
    bottom:        '/',
    jump_backward: '[',
    jump_forward:  ']',
    slow_backward: ':',
    slow_forward:  '\'',
    eject:         '\'',
    reject:        ';',
    up3:           '.',
    down3:         ',',
    left3:         '<',
    right3:        '>',
    screen_up:     '|',
    screen_down:   '\\',
    guifx:         'g',
    power:         'q',
    checkmark:     'z',
    close:         'x',
    hourglass:     'c',
    heart:         'v',
    star:          'b',
    fire:          'i',
    medical:       'o',
    police:        'p'
};

/** @enum{number} */
var g_album_art_id = {
    front:  0,
    back:   1,
    disc:   2,
    icon:   3,
    artist: 4
};

//</editor-fold>

//<editor-fold desc="String formatting">

/** @enum{number} */
var StringAlignment = {
    near:   0,
    center: 1,
    far:    2
};

/** @enum{number} */
var StringTrimming = {
    /** Specifies no trimming. */
    none:          0,
    /** Specifies that the text is trimmed to the nearest character. */
    char:          1,
    /** Specifies that text is trimmed to the nearest word. */
    word:          2,
    /** Specifies that the text is trimmed to the nearest character, and an ellipsis is inserted at the end of a trimmed line. */
    ellipsis_char: 3,
    /** Specifies that text is trimmed to the nearest word, and an ellipsis is inserted at the end of a trimmed line. */
    ellipsis_word: 4,
    /** The center is removed from trimmed lines and replaced by an ellipsis. The algorithm keeps as much of the last slash-delimited segment of the line as possible. */
    ellipsis_path: 5
};

/** @enum{number} */
var StringFormatFlags = {
    /**
     * No flags.
     */
    none:                    0x00000000,
    /**
     * Text is displayed from right to left.
     */
    direction_right_to_left: 0x00000001,
    /**
     * Text is vertically aligned.
     */
    direction_vertical:      0x00000002,
    /**
     * Parts of characters are allowed to overhang the string's layout rectangle.
     * By default, characters are repositioned to avoid any overhang.
     */
    fit_black_box:           0x00000004,
    /**
     * Control characters such as the left-to-right mark are shown in the output with a representative glyph.
     */
    display_format_control:  0x00000020,
    /**
     * Fallback to alternate fonts for characters not supported in the requested font is disabled.
     * Any missing characters are displayed with the fonts missing glyph, usually an open square.
     */
    no_font_fallback:        0x00000400,
    /**
     * Includes the trailing space at the end of each line.
     * By default the boundary rectangle returned by the MeasureString method excludes the space at the end of each line.
     * Set this flag to include that space in measurement.
     */
    measure_trailing_spaces: 0x00000800,
    /**
     * Text wrapping between lines when formatting within a rectangle is disabled.
     * This flag is implied when a point is passed instead of a rectangle, or when the specified rectangle has a zero line length
     */
    no_wrap:                 0x00001000,
    /**
     *  Only entire lines are laid out in the formatting rectangle.
     *  By default layout continues until the end of the text, or until no more lines are visible as a result of clipping, whichever comes first.
     *  Note that the default settings allow the last line to be partially obscured by a formatting rectangle that is not a whole multiple of the line height.
     *  To ensure that only whole lines are seen, specify this value and be careful to provide a formatting rectangle at least as tall as the height of one line.
     */
    line_limit:              0x00002000,
    /**
     * Overhanging parts of glyphs, and unwrapped text reaching outside the formatting rectangle are allowed to show.
     * By default all text and glyph parts reaching outside the formatting rectangle are clipped.
     */
    no_clip:                 0x00004000
};

/**
 * @param {?StringFormatFlags=} [format_flags=StringFormatFlags.none]
 * @return {StringFormat}
 * @constructor
 */
function StringFormat(format_flags) {
    if (!(this instanceof StringFormat)) {
        return new StringFormat(format_flags);
    }

    /**
     * Returns StringFormat serialized to integer number suitable for flags argument in {@link IGdiGraphics.DrawString}
     *
     * @return {number}
     */
    this.value = function () {
        return this.alignment << 28 | this.line_alignment << 24 | this.trimming << 20 | this.format_flags;
    };

    /** @type {StringAlignment} */
    this.alignment = StringAlignment.near;
    /** @type {StringAlignment} */
    this.line_alignment = StringAlignment.near;
    /** @type {StringTrimming} */
    this.trimming = StringTrimming.none;
    /** @type {StringFormatFlags} */
    this.format_flags = _.isNil(format_flags) ? StringFormatFlags.none : format_flags;
}

/**
 * {@link StringFormat} object with alignment and line_alignment set to {@link StringAlignment.center}
 *
 * @const
 * @type {StringFormat}
 */
var g_string_format_center = StringFormat();
g_string_format_center.alignment = StringAlignment.center;
g_string_format_center.line_alignment = StringAlignment.center;

//</editor-fold>

//<editor-fold desc="Exception types">

/**
 * @param {string} msg
 * @return {ThemeError}
 * @constructor
 * @extends {Error}
 */
function ThemeError(msg) {
    if (!(this instanceof ThemeError)) {
        return new ThemeError(msg);
    }

    Error.call(this, '');

    this.name = 'ThemeError';

    var err_msg = '\n';
    err_msg += msg;
    err_msg += '\n';

    this.message = err_msg;
}

ThemeError.prototype = Object.create(Error.prototype);

/**
 * @param {string} msg
 * @return {LogicError}
 * @constructor
 * @extends {Error}
 */
function LogicError(msg) {
    if (!(this instanceof LogicError)) {
        return new LogicError(msg);
    }

    Error.call(this, '');

    this.name = 'LogicError';

    var err_msg = '\n';
    err_msg += msg;
    err_msg += '\n';

    this.message = err_msg;
}

LogicError.prototype = Object.create(Error.prototype);

/**
 * @param {string} arg_name
 * @param {string} arg_type
 * @param {string} valid_type
 * @param {string=} additional_msg
 * @return {TypeError}
 * @constructor
 * @extends {Error}
 * @return {TypeError}
 */
function TypeError(arg_name, arg_type, valid_type, additional_msg) {
    if (!(this instanceof TypeError)) {
        return new TypeError(arg_name, arg_type, valid_type, additional_msg);
    }

    Error.call(this, '');

    this.name = 'TypeError';

    var err_msg = '\n';
    err_msg += '\'' + arg_name + '\' is not a ' + valid_type + ', it\'s a ' + arg_type;
    if (additional_msg) {
        err_msg += '\n' + additional_msg;
    }
    err_msg += '\n';

    this.message = err_msg;
}

TypeError.prototype = Object.create(Error.prototype);

/**
 * @param {string} arg_name
 * @param {*} arg_value
 * @param {string=} additional_msg
 * @return {ArgumentError}
 * @constructor
 * @extends {Error}
 */
function ArgumentError(arg_name, arg_value, additional_msg) {
    if (!(this instanceof ArgumentError)) {
        return new ArgumentError(arg_name, arg_value, additional_msg);
    }

    Error.call(this, '');

    this.name = 'ArgumentError';

    var err_msg = '\n';
    err_msg += '\'' + arg_name + '\' has invalid value: ' + arg_value.toString();
    if (additional_msg) {
        err_msg += '\n' + additional_msg;
    }
    err_msg += '\n';

    this.message = err_msg;
}

ArgumentError.prototype = Object.create(Error.prototype);

/**
 * @param {boolean} predicate
 * @param {T} exception_type
 * @param {...} args
 * @throws {T}
 * @template T
 */
function assert(predicate, exception_type, args) {
    if (!predicate) {
        throw exception_type.apply(null, Array.prototype.slice.call(arguments, 2));
    }
}

//</editor-fold>

var UIHacks =
    /** @type {IUIHacks} */
    new ActiveXObject('UIHacks');

var qwr_utils = {
    /**
     * @param {number} m
     */
    EnableSizing:         function (m) {
        try {
            if (UIHacks.FrameStyle === 3 && UIHacks.DisableSizing) {
                UIHacks.DisableSizing = false;
            }
        }
        catch (e) {
            console.log(e)
        }
    },
    /**
     * @param {number} m
     */
    DisableSizing:        function (m) {
        try {
            if (m && UIHacks.FrameStyle === 3 && !UIHacks.DisableSizing) {
                UIHacks.DisableSizing = true;
            }
        }
        catch (e) {
            console.log(e)
        }
    },
    /**
     * @return {string}
     */
    caller:               function () {
        var caller = /^function\s+([^(]+)/.exec(/** @type{string} */ arguments.callee.caller.caller);
        return caller ? caller[1] : '';
    },
    /**
     * @return {string}
     */
    function_name:        function () {
        var caller = /^function\s+([^(]+)/.exec(/** @type{string} */ arguments.callee.caller);
        return caller ? caller[1] : '';
    },
    /**
     * @param{Array<string>} fonts
     */
    check_fonts:          function (fonts) {
        var msg = '';
        var fail_counter = 0;

        fonts.forEach(function (item) {
            var check = utils.CheckFont(item);
            if (!check) {
                ++fail_counter;
            }
            msg += ('\n' + item + (check ? ': Installed.' : ': NOT INSTALLED!'));
        });

        if (fail_counter) {
            msg += '\n\nPlease install missing ' + (fail_counter > 1 ? 'fonts' : 'font') + ' and restart foobar!';
            throw ThemeError(msg);
        }
    },
    /**
     * @return{boolean}
     */
    has_modded_jscript:   _.once(function () {
        var ret = _.attempt(function () {
            // Methods from modded JScript
            wsh_utils.GetWndByHandle(666);
            fb.IsMainMenuCommandChecked('View/Always on Top');
        });

        return !_.isError(ret);
    }),
    /**
     * @param{string} site
     * @param{IFbMetadbHandle} metadb
     */
    link:                 function (site, metadb) {
        if (!metadb) {
            return;
        }

        var meta_info = metadb.GetFileInfo();
        var artist = meta_info.MetaValue(meta_info.MetaFind('artist'), 0).replace(/\s+/g, '+').replace(/&/g, '%26');
        var album = meta_info.MetaValue(meta_info.MetaFind('album'), 0).replace(/\s+/g, '+');
        var title = meta_info.MetaValue(meta_info.MetaFind('title'), 0).replace(/\s+/g, '+');

        var search_term = artist ? artist : title;

        switch (site.toLowerCase()) {
            case 'google':
                site = (search_term ? 'http://images.google.com/search?q=' + search_term + '&ie=utf-8' : null);
                break;
            case 'googleimages':
                site = (search_term ? 'http://images.google.com/images?hl=en&q=' + search_term + '&ie=utf-8' : null);
                break;
            case 'ecover':
                site = (search_term || album ? 'http://ecover.to/?Module=ExtendedSearch&SearchString=' + search_term + '+' + album + '&ie=utf-8' : null);
                break;
            case 'wikipedia':
                site = (artist ? 'http://en.wikipedia.org/wiki/' + artist.replace(/\+/g, '_') : null);
                break;
            case 'youtube':
                site = (search_term ? 'http://www.youtube.com/results?search_type=&search_query=' + search_term + '&ie=utf-8' : null);
                break;
            case 'lastfm':
                site = (search_term ? 'http://www.last.fm/music/' + search_term.replace('/', '%252F') : null);
                break;
            case 'discogs':
                site = (search_term || album ? 'http://www.discogs.com/search?q=' + search_term + '+' + album + '&ie=utf-8' : null);
                break;
            default:
                site = '';
        }

        if (!site) {
            return;
        }

        _.run(site);
    },
    /**
     * @constructor
     */
    MouseMoveSuppress:    function () {
        this.is_supressed = function (x, y, m) {
            if (saved_x === x && saved_y === y && saved_m === m) {
                return true;
            }

            saved_x = x;
            saved_y = y;
            saved_m = m;

            return false;
        };

        var saved_x;
        var saved_y;
        var saved_m;
    },
    /**
     * @constructor
     */
    KeyModifiersSuppress: function () {
        this.is_supressed = function (key) {
            if ((VK_SHIFT === key || VK_CONTROL === key || VK_MENU === key) && saved_key === key) {
                return true;
            }

            saved_key = key;

            return false;
        };

        var saved_key;
    },
    /**
     * @return {IWindow}
     */
    get_fb2k_window:      _.once(function () {
        if (!qwr_utils.has_modded_jscript()) {
            throw LogicError('Can\'t use extensions with vanilla JScript')
        }

        // fb2k main window class
        // Can't use UIHacks.MainWindowID, since it might be uninitialized during fb2k start-up
        var ret_wnd = wsh_utils.GetWndByHandle(window.id);
        while (ret_wnd && ret_wnd.GetAncestor(1) && ret_wnd.className !== '{E7076D1C-A7BF-4f39-B771-BCBE88F2A2A8}') {// We might have multiple instances of fb2k, thus getting the parent one instead of global search
            ret_wnd = ret_wnd.GetAncestor(1);
        }

        if (!ret_wnd || ret_wnd.className !== '{E7076D1C-A7BF-4f39-B771-BCBE88F2A2A8}') {
            throw LogicError('Failed to get top theme window')
        }

        return ret_wnd;
    }),
    /**
     * @return {IWindow}
     */
    get_top_theme_window: _.once(function () {
        if (!qwr_utils.has_modded_jscript()) {
            throw LogicError('Can\'t use extensions with vanilla JScript')
        }

        var ret_wnd = wsh_utils.GetWndByHandle(window.id);
        while (ret_wnd && ret_wnd.GetAncestor(1) && ret_wnd.GetAncestor(1).id !== qwr_utils.get_fb2k_window().id) {
            ret_wnd = ret_wnd.GetAncestor(1);
        }

        if (!ret_wnd || ret_wnd.GetAncestor(1).id !== qwr_utils.get_fb2k_window().id) {
            throw LogicError('Failed to get top theme window')
        }

        return ret_wnd;
    }),
    /**
     * @return {string}
     */
    get_windows_version:  _.once(function () {
        var version = '';
        var ret = _.attempt(function () {
            version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
            version += '.';
            version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
        });

        if (!_.isError(ret)) {
            return version;
        }

        ret = _.attempt(function () {
            version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
        });

        if (!_.isError(ret)) {
            return version;
        }

        return '6.1';
    })
};

/**
 * @constructor
 */
function KeyActionHandler() {
    /**
     * @param{string} key
     * @param{function({ctrl: ?boolean, alt: ?boolean, shift: ?boolean})} action_callback
     */
    this.register_key_action = function (key, action_callback) {
        if (!action_callback) {
            throw ArgumentError('action_callback', action_callback);
        }

        if (!_.isNil(actions[key])) {
            throw ArgumentError('key', key.toString(), 'This key is already used');
        }

        actions[key] = action_callback;
    };

    /**
     * @param{string} key
     * @param{object=} [key_modifiers={}] passed to key action callback
     * @param{boolean=} [key_modifiers.ctrl=false]
     * @param{boolean=} [key_modifiers.alt=false]
     * @param{boolean=} [key_modifiers.shift=false]
     * @return{boolean} true, if key is registered, false - otherwise
     */
    this.invoke_key_action = function (key, key_modifiers) {
        var key_action = actions[key];
        if (!actions[key]) {
            return false;
        }

        key_action(key_modifiers ? key_modifiers : {});

        return true;
    };

    /** @type {Object<number, function({ctrl: ?boolean, alt: ?boolean, shift: ?boolean})>} */
    var actions = {};
}

/**
 * @param{string} name
 * @param{*} default_value
 * @constructor
 */
function PanelProperty(name, default_value) {
    /**
     * @return {*}
     */
    this.get = function () {
        return value;

    };
    /**
     * @param {*} new_value
     */
    this.set = function (new_value) {
        if (value !== new_value) {
            window.SetProperty(this.name, new_value);
            value = new_value;
        }
    };

    /** @const {string} */
    this.name = name;

    /** @type {*} */
    var value = window.GetProperty(this.name, default_value);
}

/**
 * @hideconstructor
 */
var PanelProperties = (function () {
    /**
     * @constructor
     */
    function PanelProperties() {
        /**
         * @param {Object<string, Array<string, *>>} properties Each item in array is an object of the following type { string, [string, any] }
         */
        this.add_properties = function (properties) {
            _.forEach(properties, function (item, i) {
                validate_property_item(item, i);
                add_property_item(item, i);
            });
        };

        function validate_property_item(item, item_id) {
            if (!_.isArray(item) || item.length !== 2 || !_.isString(item[0])) {
                throw TypeError('property', typeof item, '{ string, [string, any] }', 'Usage: add_properties({\n  property_id: [property_name, property_default_value]\n})');
            }
            if (item_id === 'add_properties') {
                throw ArgumentError('property_id', item_id, 'This id is reserved');
            }
            if (!_.isNil(that[item_id]) || !_.isNil(that[item_id + '_internal'])) {
                throw ArgumentError('property_id', item_id, 'This id is already occupied');
            }
            if (!_.isNil(name_list[item[0]])) {
                throw ArgumentError('property_name', item[0], 'This name is already occupied');
            }
        }

        function add_property_item(item, item_id) {
            name_list[item[0]] = 1;

            that[item_id + '_internal'] = new PanelProperty(item[0], item[1]);

            Object.defineProperty(that, item_id, {
                get: function () {
                    return that[item_id + '_internal'].get()
                },
                set: function (new_value) {
                    that[item_id + '_internal'].set(new_value)
                }
            });
        }

        var that = this;
        /**
         * Used for collision checks only
         *
         * @type {Object<string, number>}
         */
        var name_list = {};
    }

    var instance = null;

    return {
        /**
         * @alias PanelProperties.get_instance
         * @returns {PanelProperties}
         */
        get_instance: function () {
            if (!instance) {
                instance = new PanelProperties();
                delete instance.constructor;
            }
            return instance;
        }
    };
})();

var g_properties = PanelProperties.get_instance();

var g_script_list = ['Common.js'];
