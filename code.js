/**
 * bky-parsec Copyright 2018 maxence operations gmbh. All rights reserved.
 * http://www.maxence.de/
 */
/**
 * Create a namespace for the application.
 */
var parserNames = [];

var mxcParsec = (function(app, undefined) {

  'use strict';

  /**
   * Blockly's main workspace.
   *
   * @type {Blockly.WorkspaceSvg}
   */
   app.workspace = null;

   var customContextMenuFn = function(options) {
    var option = {
      enabled: true,
      text: "Custom option",
      callback: function() {
        console.log('Custom context menu option called');
      }
    };
    options.push(option);
  };

  /**
   * Lookup for names of supported languages. Keys should be in ISO 639 format.
   */
  var LANGUAGE_NAME = {
    'de': 'Deutsch',
    'en': 'English',
  };

  /**
   * List of RTL languages.
   */
  var LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

  /**
   * Execute the user's var Just a quick and dirty eval. Catch infinite loops.
   * Not currently used.
   */
  var runJS = function() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
    var timeouts = 0;
    var checkTimeout = function() {
      if (timeouts++ > 1000000) {
        throw MSG['timeout'];
      }
    };
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      eval(code);
    } catch (e) {
      alert(MSG['badcode'].replace('%1', e));
    }
  };

  /**
   * Discard all blocks from the workspace.
   */
  var discard = function() {
    var blocks = app.workspace.getAllBlocks();
    var count = blocks.length;
    if (count < 2 || window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
      for (var block of blocks) {
        block.setDeletable(true);
      }
      app.workspace.clear();
      if (window.location.hash) {
        window.location.hash = '';
      }
    }
  };

  /**
   * Extracts a parameter from the URL. If the parameter is absent default_value
   * is returned.
   *
   * @param {string}
   *          name The name of the parameter.
   * @param {string}
   *          defaultValue Value to return if parameter not found.
   * @return {string} The parameter value or the default value if not found.
   */
  var getStringParamFromUrl = function(name, defaultValue) {
    var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) :
      defaultValue;
  };

  /**
   * Get the language of this user from the URL.
   *
   * @return {string} User's language.
   */
  var getLang = function() {
    var lang = getStringParamFromUrl('lang', '');
    if (LANGUAGE_NAME[lang] === undefined) {
      // Default to English.
      lang = 'en';
    }
    return lang;
  };

  /**
   * Is the current language (var LANG) an RTL language?
   *
   * @return {boolean} True if RTL, false if LTR.
   */
  var isRtl = function() {
    return LANGUAGE_RTL.indexOf(LANG) != -1;
  };

  /**
   * Load blocks saved on App Engine Storage or in session/local storage.
   *
   * @param {string}
   *          defaultXml Text representation of default blocks.
   */
  var loadBlocks = function(defaultXml) {
    try {
      var loadOnce = window.sessionStorage.loadOnceBlocks;
    } catch (e) {
      // Firefox sometimes throws a SecurityError when accessing sessionStorage.
      // Restarting Firefox fixes this, so it looks like a bug.
      var loadOnce = null;
    }
    if ('BlocklyStorage' in window && window.location.hash.length > 1) {
      // An href with #key trigers an AJAX call to retrieve saved blocks.
      BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else if (loadOnce) {
      // Language switching stores the blocks during the reload.
      delete window.sessionStorage.loadOnceBlocks;
      var xml = Blockly.Xml.textToDom(loadOnce);
      Blockly.Xml.domToWorkspace(xml, app.workspace);
    } else if (defaultXml) {
      // Load the editor with default starting blocks.
      var xml = Blockly.Xml.textToDom(defaultXml);
      Blockly.Xml.domToWorkspace(xml, app.workspace);
    } else if ('BlocklyStorage' in window) {
      // Restore saved blocks in a separate thread so that subsequent
      // initialization is not affected from a failed load.
      window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
  };

  /**
   * Save the blocks and reload with a different language.
   */
  var changeLanguage = function() {
    // Store the blocks for the duration of the reload.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (window.sessionStorage) {
      var xml = Blockly.Xml.workspaceToDom(app.workspace);
      var text = Blockly.Xml.domToText(xml);
      window.sessionStorage.loadOnceBlocks = text;
    }

    var languageMenu = document.getElementById('languageMenu');
    var newLang = encodeURIComponent(languageMenu.options[languageMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
      search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
      search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
      search = search.replace(/\?/, '?lang=' + newLang + '&');
    }

    window.location = window.location.protocol + '//' + window.location.host +
      window.location.pathname + search;
  };

  /**
   * Bind a function to a button's click event. On touch enabled browsers,
   * ontouchend is treated as equivalent to onclick.
   *
   * @param {!Element|string}
   *          el Button element or ID thereof.
   * @param {!Function}
   *          func Event handler to bind.
   */
  var bindClick = function(el, func) {
    if (typeof el == 'string') {
      el = document.getElementById(el);
    }
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
  };

  /**
   * Load the Prettify CSS and JavaScript.
   */
  var importPrettify = function() {
    var script = document.createElement('script');
    script
      .setAttribute(
        'src',
        'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
    document.head.appendChild(script);
  };

  /**
   * Compute the absolute coordinates and dimensions of an HTML element.
   *
   * @param {!Element}
   *          element Element to match.
   * @return {!Object} Contains height, width, x, and y properties.
   * @private
   */
  var getBBox_ = function(element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    return {
      height: height,
      width: width,
      x: x,
      y: y
    };
  };

  /**
   * User's language (e.g. "en").
   *
   * @type {string}
   */
  var LANG = getLang();

  /**
   * List of tab names.
   *
   * @private
   */
  var TABS_ = ['blocks', 'php', 'xml'];

  /**
   * Currently selected tab pane
   *
   * @private
   */
  var selected = 'blocks';

  /**
   * Switch the visible pane when a tab is clicked.
   *
   * @param {string}
   *          clickedName Name of tab clicked.
   */
  var tabClick = function(clickedName) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlText = xmlTextarea.value;
      var xmlDom = null;
      try {
        xmlDom = Blockly.Xml.textToDom(xmlText);
      } catch (e) {
        var q = window.confirm(MSG['badXml'].replace('%1', e));
        if (!q) {
          // Leave the user on the XML tab.
          return;
        }
      }
      if (xmlDom) {
        app.workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, app.workspace);
      }
    }

    if (document.getElementById('tab_blocks').className == 'tabon') {
      app.workspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < TABS_.length; i++) {
      var name = TABS_[i];
      document.getElementById('tab_' + name).className = 'taboff';
      document.getElementById('content_' + name).style.visibility = 'hidden';
    }

    // Select the active tab.
    selected = clickedName;
    document.getElementById('tab_' + clickedName).className = 'tabon';
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility = 'visible';
    renderContent();
    if (clickedName == 'blocks') {
      app.workspace.setVisible(true);
    }
    Blockly.svgResize(app.workspace);
  };

  /**
   * Populate the currently selected pane with content generated from the
   * blocks.
   */
  var renderContent = function() {
    var content = document.getElementById('content_' + selected);
    // Initialize the pane.
    if (content.id == 'content_xml') {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlDom = Blockly.Xml.workspaceToDom(app.workspace);
      var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
      xmlTextarea.value = xmlText;
      xmlTextarea.focus();
    } else if (content.id == 'content_php') {
      attemptCodeGeneration(Blockly.PHP, 'php');
    }
  };

  /**
   * Attempt to generate the code and display it in the UI, pretty printed.
   *
   * @param generator
   *          {!Blockly.Generator} The generator to use.
   * @param prettyPrintType
   *          {string} The file type key for the pretty printer.
   */
  var attemptCodeGeneration = function(generator, prettyPrintType) {
    var content = document.getElementById('content_' + selected);
    content.textContent = '';
    if (checkAllGeneratorFunctionsDefined(generator)) {
      var code = generator.workspaceToCode(app.workspace);

      content.textContent = code;
      if (typeof PR.prettyPrintOne == 'function') {
        code = content.textContent;
        code = PR.prettyPrintOne(code, prettyPrintType);
        content.innerHTML = code;
      }
    }
  };

  /**
   * Check whether all blocks in use have generator functions.
   *
   * @param generator
   *          {!Blockly.Generator} The generator to use.
   */
  var checkAllGeneratorFunctionsDefined = function(generator) {
    var blocks = app.workspace.getAllBlocks();
    var missingBlockGenerators = [];
    for (var i = 0; i < blocks.length; i++) {
      var blockType = blocks[i].type;
      if (!generator[blockType]) {
        if (missingBlockGenerators.indexOf(blockType) === -1) {
          missingBlockGenerators.push(blockType);
          generator[blockType] = Generator.generators["undone_generator"];
        }
      }
    }

    var valid = missingBlockGenerators.length == 0;
    if (!valid) {
      var msg = 'The generator code for the following blocks not specified for ' +
        generator.name_ +
        ':\n - ' +
        missingBlockGenerators.join('\n - ');
      console.log(msg);
    }
    return true;
  };

  /**
   * Initialize Blockly. Called on page load.
   */
  var init = function() {
    initLanguage();

    var rtl = isRtl();
    var container = document.getElementById('content_area');
    var onresize = function(e) {
      var bBox = getBBox_(container);
      for (var i = 0; i < TABS_.length; i++) {
        var el = document.getElementById('content_' + TABS_[i]);
        el.style.top = bBox.y + 'px';
        el.style.left = bBox.x + 'px';
        // Height and width need to be set, read back, then set again to
        // compensate for scrollbars.
        el.style.height = bBox.height + 'px';
        el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
        el.style.width = bBox.width + 'px';
        el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
      }
      // Make the 'Blocks' tab line up with the toolbox.
      if (app.workspace && app.workspace.toolbox_.width) {
        document.getElementById('tab_blocks').style.minWidth = (app.workspace.toolbox_.width - 38) +
          'px';
        // Account for the 19 pixel margin and on each side.
      }
    };
    window.addEventListener('resize', onresize, false);
    // Generator.registerGenerators();
    var config = Config.setup();

    Blockly.defineBlocksWithJsonArray(config.blocks);
    var toolboxXml = Blockly.Xml.textToDom(config.toolbox);
    app.workspace = Blockly.inject('content_blocks', {
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      media: '../../media/',
      rtl: rtl,
      toolbox: toolboxXml,
      zoom: {
        controls: true,
        wheel: true
      }
    });

    // corrects parserNames Array if a rule or grammar block is deleted
    function onDeletionNameHandler(event) {
      if (event.type == Blockly.Events.DELETE) {

        var parser = new DOMParser();

        var blockXML = event.oldXml.outerHTML;
        var doc = parser.parseFromString(blockXML, "text/html");
        var blockHtml = doc.getElementsByTagName("block");
        var blockType = blockHtml[0].getAttribute("type");

        if (blockType == "rule_type" || blockType == "grammar_type") {
          var blockField = blockHtml[0].children[0];
          var blockName = blockField.innerHTML;
          if (parserNames.includes(blockName)) {
            var i = parserNames.indexOf(blockName);
            parserNames.splice(i, 1);
          }
        }

        if (blockType == "reference_type") {
          var allTopBlocks = app.workspace.getTopBlocks(false);

          var blockField = blockHtml[0].children[0];
          var blockName = blockField.innerHTML;

          for (var topBlock of allTopBlocks) {
            var topBlockName = topBlock.getFieldValue('PARAM1');

            if (topBlockName == blockName) {
              makeBlockDeletable(topBlock);
            }
          }
        }
      }
    }

    app.workspace.configureContextMenu = customContextMenuFn;
    app.workspace.addChangeListener(onDeletionNameHandler);

    // Register only the extensions actually used by blocks
    Extensions.init(config.extensions);
    loadBlocks('');

    if ('BlocklyStorage' in window) {
      // Hook a save function onto unload.
      BlocklyStorage.backupOnUnload(app.workspace);
    }

    tabClick(selected);

    bindClick('trashButton', function() {
      discard();
      renderContent();
    });
    // var bindClick('runButton', var runJS);
    // Disable the link button if page isn't backed by App Engine storage.
    var linkButton = document.getElementById('linkButton');
    if ('BlocklyStorage' in window) {
      BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
      BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
      BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
      BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
      bindClick(linkButton, function() {
        BlocklyStorage.link(app.workspace);
      });
    } else if (linkButton) {
      linkButton.className = 'disabled';
    }

    for (var i = 0; i < TABS_.length; i++) {
      var name = TABS_[i];
      bindClick('tab_' + name, function(name_) {
        return function() {
          tabClick(name_);
        };
      }(name));
    }
    onresize();
    Blockly.svgResize(app.workspace);

    // Lazy-load the syntax-highlighting.
    window.setTimeout(importPrettify, 1);
  };

  /**
   * Initialize the page language.
   */
  var initLanguage = function() {
    // Set the HTML's language and direction.
    var rtl = isRtl();
    document.dir = rtl ? 'rtl' : 'ltr';
    document.head.parentElement.setAttribute('lang', LANG);

    // Sort languages alphabetically.
    var languages = [];
    for (var lang in LANGUAGE_NAME) {
      languages.push([LANGUAGE_NAME[lang], lang]);
    }
    var comp = function(a, b) {
      // Sort based on first argument ('English', 'Русский', '简体字', etc).
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    };
    languages.sort(comp);
    // Populate the language selection menu.
    var languageMenu = document.getElementById('languageMenu');
    languageMenu.options.length = 0;
    for (var i = 0; i < languages.length; i++) {
      var tuple = languages[i];
      var lang = tuple[tuple.length - 1];
      var option = new Option(tuple[0], lang);
      if (lang == LANG) {
        option.selected = true;
      }
      languageMenu.options.add(option);
    }
    languageMenu.addEventListener('change', changeLanguage, true);

    // Inject language strings.
    document.title += ' ' + MSG['title'];
    document.getElementById('title').textContent = MSG['title'];
    document.getElementById('tab_blocks').textContent = MSG['blocks'];

    document.getElementById('linkButton').title = MSG['linkTooltip'];
    document.getElementById('runButton').title = MSG['runTooltip'];
    document.getElementById('trashButton').title = MSG['trashTooltip'];
  };

  app.dynamicReferenceOptions = function() {
    var options = [];
    for (var option of parserNames) {
      options.push([option, option]);
    }
    if (parserNames.length == 0) {
      options = [
        ['please create a parser first', 'error']
      ];
    }
    return options;
  }
  
  //mxParsec.workspace.addChangeListener(checkForDeletion);
  //Blockly.workspace.addChangeListener(checkForDeletion);
  app.checkForDeletion = function() {
    var test = this;
  }

  // Load the cpde demo's language strings.
  document.write('<script src="msg/' + LANG + '.js"></script>\n');
  // Load Blockly's language strings.
  document.write('<script src="../../msg/js/' + LANG + '.js"></script>\n');
  window.addEventListener('load', init);

  return app;

})(mxcParsec || {});

console.log('Public interface of mxcParsec: ', mxcParsec);