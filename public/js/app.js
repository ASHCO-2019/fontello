var fm = (function (fm) {
    var cfg = {
        id: {
            tab: "#tab",
            select: "#select",
            rearrange: "#rearrange",
            save: "#save",
            notification: "#notifications-container",

            bad_browser: "#fm-bad-browser",
            glyph_count: "#fm-glyph-count",

            icon_size: "#fm-icon-size",
            file: "#fm-file",
            file_browse_button: "#fm-file-browse-button",
            file_drop_zone: "#fm-file-drop-zone",
            use_embedded: "#fm-use-embedded",

            form_charset: "#fm-form-charset",

            tab_save: "#fm-tab-save",
            font_list: "#fm-font-list",
            generated_font: "#fm-generated-font",

            font: "#fm-font",
            download_font_button: "#fm-download-font-button",
            icon_assignments: "#fm-icon-assignments",
            font_output: "#fm-font-output"
        },
        class: {
            font_name: ".fm-font-name",
            glyph_group: ".fm-glyph-group",
            glyph_div: ".fm-glyph-div",
            rg_icon: ".rg-icon",
            disable_on_demand: ".fm-disable-on-demand"
        },
        template: {
            glyph: { id: "#fm-tpl-glyph" },
            glyph_group: { id: "#fm-tpl-glyph-group" },
            font: { id: "#fm-tpl-font" },
            rearrange_glyph: { id: "#fm-tpl-rearrange-glyph" }
        },

        // class icon_size_prefix+"-<num>" added when icon size has changed
        icon_size_prefix: "fm-icon-size-",
        icon_size_classes: "", // precalculated by initGlobals()

        preview_icon_sizes: [32, 24, 16],
        live_update: true,
        fix_edges: true,
        scale_precision: 6, // truncate the mantissa when scaling svg paths
        basic_latin: {
            str: "",    // precalculated by initGlobals()
            begin: 33,
            end: 126,
            extra: " ",
        },
        unicode_private: {
            begin: 0xf0000,
            end: 0xf005e
        },
        draggable_options: {
            revert: "invalid",
            cursor: "move",
            helper: "clone",
            opacity: 0.5,
            disabled: false
        },
        droppable_options: {
            hoverClass: "fm-drop-hover",
            tolerance: "pointer"
        },
        path_options: {
            fill: "#000",
            stroke: "#000",
            "stroke-width": 0
        },
        zero_clipboard: {
            swf_path: "img/ZeroClipboard.swf",

            links: [
                {
                    link: "fm-clipboard-link",
                    span: "fm-clipboard-span",
                    target: "font"
                },
                {
                    link: "fm-clipboard-link2",
                    span: "fm-clipboard-span2",
                    target: "icon_assignments"
                }
            ]
        },
        notify: {
            dup: {},    // for suppressing duplicates

            // notication types
            info: {
                tpl: "basic-template",
                tpl_vars: {},
                opts: { expires: 4000 },
            },
            alert: {
                tpl: "icon-template",
                tpl_vars: { icon: "img/alert.png" },
                opts: { expires: 4000 }
            }
        },
        output: {
            filename: "fontomas.svg",
            font_id: "FontomasCustom",
            horiz_adv_x: 500,
            units_per_em: 1000,
            ascent: 750,
            descent: -250,
            metadata: "This is a custom SVG font generated by Fontomas",
            missing_glyph_horiz_adv_x: 500
        }
    };

    // environment
    var env = {
        flash_version: swfobject.getFlashPlayerVersion(),
        is_file_proto: (window.location.protocol == "file:"),
        filereader: null
    };

    var App = {
        Models: {},
        Collections: {},
        Views: {}
    };

    var debug = {
        is_on: false
    };

    var initCfg = function () {
        console.log("initCfg");

        // init icon_size_classes
        cfg.icon_size_classes = cfg.preview_icon_sizes.map(function (item) {
            return cfg.icon_size_prefix+item;
        }).join(" ");

        // init cfg.basic_latin.str
        cfg.basic_latin.str = "";
        for (var i=cfg.basic_latin.begin; i<=cfg.basic_latin.end; i++)
            cfg.basic_latin.str += String.fromCharCode(i);
        cfg.basic_latin.str += cfg.basic_latin.extra;

        // init templates
        for (var key in cfg.template) {
            cfg.template[key].tpl = $(cfg.template[key].id).clone()
                .removeAttr("id");
            $(cfg.template[key].id).remove();
        }

        // init clipboard link targets
        for (var i=0, len=cfg.zero_clipboard.links.length; i<len; i++) {
            var item=cfg.zero_clipboard.links[i];
            item.target = cfg.id[item.target];
        }
    };

    // usage: index.html#debug:maxglyphs=10,noembedded,noflash,nofilereader
    var initDebug = function () {
        var hash = window.location.hash.substr(1);
        var params = hash.split("&");
        for (var i=0, len=params.length; i<len; i++) {
            if (params[i].split(":").indexOf("debug") == 0) {
                debug.is_on = true;
                var vars = params[i].split(":")[1].split(",");
                for (var i=0, len=vars.length; i<len; i++) {
                    var pair = vars[i].split("=");
                    debug[pair[0]] = pair[1] && pair[1] !== "" ? pair[1] : true;
                }
                break;
            }
        }

        // debug: simulate no flash plugin installed
        if (debug.is_on && debug.noflash)
            for (var key in env.flash_version)
                env.flash_version[key] = 0;
    };

    (function () {
        initCfg();
        initDebug();
    })();

    // public interface
    return $.extend(true, fm, {
        cfg: cfg,
        env: env,
        App: App,
        debug: debug
    });
})(fm || {});
