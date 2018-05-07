/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'be-tarask': 'Taraškievica',
  'br': 'Brezhoneg',
  'ca': 'Català',
  'cs': 'Česky',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'et': 'Eesti',
  'fa': 'فارسی',
  'fr': 'Français',
  'he': 'עברית',
  'hrx': 'Hunsrik',
  'hu': 'Magyar',
  'ia': 'Interlingua',
  'is': 'Íslenska',
  'it': 'Italiano',
  'ja': '日本語',
  'kab': 'Kabyle',
  'ko': '한국어',
  'mk': 'Македонски',
  'ms': 'Bahasa Melayu',
  'nb': 'Norsk Bokmål',
  'nl': 'Nederlands, Vlaams',
  'oc': 'Lenga d\'òc',
  'pl': 'Polski',
  'pms': 'Piemontèis',
  'pt-br': 'Português Brasileiro',
  'ro': 'Română',
  'ru': 'Русский',
  'sc': 'Sardu',
  'sk': 'Slovenčina',
  'sr': 'Српски',
  'sv': 'Svenska',
  'ta': 'தமிழ்',
  'th': 'ภาษาไทย',
  'tlh': 'tlhIngan Hol',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh-hans': '简体中文',
  'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if parameter not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
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
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function(element) {
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
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'php', 'xml'];

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function(clickedName) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }

  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
      'visible';
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_php') {
    Code.attemptCodeGeneration(Blockly.PHP, 'php');
  }
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 * @param prettyPrintType {string} The file type key for the pretty printer.
 */
Code.attemptCodeGeneration = function(generator, prettyPrintType) {
  var content = document.getElementById('content_' + Code.selected);
  content.textContent = '';
  if (Code.checkAllGeneratorFunctionsDefined(generator)) {
    var code = generator.workspaceToCode(Code.workspace);

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
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks();
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) === -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = 'The generator code for the following blocks not specified for '
        + generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
    Blockly.alert(msg);  // Assuming synchronous. No callback.
  }
  return valid;
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var onresize = function(e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
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
    if (Code.workspace && Code.workspace.toolbox_.width) {
      document.getElementById('tab_blocks').style.minWidth =
          (Code.workspace.toolbox_.width - 38) + 'px';
          // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);

  // The toolbox XML specifies each category name using Blockly's messaging
  // format (eg. `<category name="%{BKY_CATLOGIC}">`).
  // These message keys need to be defined in `Blockly.Msg` in order to
  // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
  // been defined for each language to import each category name message
  // into `Blockly.Msg`.
  // TODO: Clean up the message files so this is done explicitly instead of
  // through this for-loop.
  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') == 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  Code.registerBlocksAndGenerators();

  // Construct the toolbox XML, replacing translated variable names.
  var toolboxText = document.getElementById('toolbox').outerHTML;
  toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
      function(m, p1, p2) {return p1 + MSG[p2];});
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);
  //Code.registerBlocksAndGenerators();


  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#ccc',
           snap: true},
       media: '../../media/',
       rtl: rtl,
       toolbox: toolboxXml,
       zoom:
           {controls: true,
            wheel: true}
      });

  Code.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
      function() {Code.discard(); Code.renderContent();});
  //Code.bindClick('runButton', Code.runJS);
  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
        function() {BlocklyStorage.link(Code.workspace);});
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
        function(name_) {return function() {Code.tabClick(name_);};}(name));
  }
  onresize();
  Blockly.svgResize(Code.workspace);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Register generators
 */
Code.registerBlocksAndGenerators = function() {

	var no_args_generator = function(block) {
		var parser = generators[block.type]["name"];
		return '["'+ parser + '", []], ';
	};

	var args_parser_generator = function(block) {
		// @todo: sequencer einbauen
		var parser = generators[block.type]["name"];
		var statements_param = Blockly.PHP.statementToCode(block, "param");
		return '["'+ parser + '", [' + statements_param + ']], ';
	};

	var args_integer_generator = function(block) {
		// @todo: sequencer einbauen
		var parser = generators[block.type]["name"];
		var value_param = Blockly.PHP.valueToCode(block, "param", Blockly.PHP.ORDER_NONE);
		return '["' + parser + '", [' + value_param + ']], ';
	};

	var args_float_generator = args_integer_generator;
	var args_binary_generator = args_integer_generator;
	var args_char_generator = args_integer_generator;

	var args_parser_parser_generator = function(block) {
		// @todo: sequencer einbauen
		var parser = generators[block.type]["name"];
		var statements_param1 = Blockly.PHP.statementToCode(block, 'param1');
		var statements_param2 = Blockly.PHP.statementToCode(block, 'param2');
		return '["'+ parser + '", [[' + statements_param1 + ', ' + statements_param2
		+ ']], ';
	};

	var args_parserarray_generator = function(block) {
		var parser = generators[block.type]["name"];
		var statements_param = Blockly.PHP.statementToCode(block, 'param');
		return '["'+parser+'", [[' + statements_param + ']]], ';
	};

	var undone_generator = function(block) {
		var parser = generators[block.type]["name"];
		return "[*** " + parser + " (undone) ***]";
	};

	var createSingleValueInputBlock = function(bType) {
		var block = createParserBlock(bType);
		if (generators[bType]["msg0"] != null) {
			block["message0"] = generators[bType]["msg0"];
		} else {
			block["message0"] = block["message0"] + " %1";
		}
		block["args0"]= [{
			"type": "input_value",
			"name": "param",
			"check": generators[bType]["check"]
		}];
	  	return block;
	}

	var createSingleStatementInputBlock = function(bType) {
		var block = createParserBlock(bType);
		if (generators[bType]["msg0"] != null) {
			block["message0"] = generators[bType]["msg0"];
		} else {
			block["message0"] = block["message0"] + " %1";
		}
		block["args0"]= [{
			"type": "input_statement",
			"name": "param",
			"check": generators[bType]["check"]
		}];
	  	return block;
	}

	var createBasicBlock = function(bType) {
		return {
		  "type":bType,
		  "message0":bType.substr(0, bType.length-5),
		  "helpUrl": "%{BKY_HELPURL_" + bType.toUpperCase() + "}",
		  "tooltip": "%{BKY_TOOLTIP_" + bType.toUpperCase() + "}",
		  "colour":230
		};
	}

	var createParserBlock = function(bType) {
		var block = createBasicBlock(bType);
		block["previousStatement"] = "parser";
		block["nextStatement"] = "parser";
		return block;
	}

  	var createCharClassifierBlock = function(bType) {
  		return createParserBlock(bType);
  	}

  	var createAllValuesBlock = function(bType) {
  		var block = createBasicBlock(bType);
  		block["message0"] = "all";
  		block["output"] = generators[bType]["output"] ? generators[bType]["output"] : null;
  		return block;
  	}

  	var generators = {
  	    all_null_type:{"name":"all","blockgenerator":createAllValuesBlock,"codegenerator":no_args_generator,"output":"all_null_type"},
	    eol_type:{"name":"eol","blockgenerator":createParserBlock,"codegenerator":no_args_generator},
	    eoi_type:{"name":"eoi","blockgenerator":createParserBlock,"codegenerator":no_args_generator},
	    eps_type:{"name":"eps","blockgenerator":createParserBlock,"codegenerator":no_args_generator},
	    alpha_type:{"name":"alpha","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    alnum_type:{"name":"alnum","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    digit_type:{"name":"digit","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    xdigit_type:{"name":"xdigit","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    upper_type:{"name":"upper","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    lower_type:{"name":"lower","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    graph_type:{"name":"graph","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    print_type:{"name":"print","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    punct_type:{"name":"punct","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    cntrl_type:{"name":"cntrl","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    space_type:{"name":"space","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    blank_type:{"name":"blank","blockgenerator":createCharClassifierBlock,"codegenerator":no_args_generator},
	    true_type:{"name":"true","blockgenerator":createParserBlock,"codegenerator":no_args_generator},
	    false_type:{"name":"false","blockgenerator":createParserBlock,"codegenerator":no_args_generator},
	    difference_type:{"name":"difference","blockgenerator":createParserBlock,"codegenerator":args_parser_parser_generator},
	    list_type:{"name":"list","blockgenerator":createParserBlock,"codegenerator":args_parser_parser_generator},
	    plus_type:{"name":"plus","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    kleene_type:{"name":"kleene","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    expect_type:{"name":"expect","blockgenerator":createParserBlock,"codegenerator":args_parser_parser_generator},
	    optional_type:{"name":"optional","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    lazy_type:{"name":"lazy","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    not_type:{"name":"not","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    and_type:{"name":"and","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    as_string_type:{"name":"as_string","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    skip_type:{"name":"skip","blockgenerator":createParserBlock,"codegenerator":args_parser_generator},
	    no_skip_type:{"name":"no_skip","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    no_case_type:{"name":"no_case","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    raw_type:{"name":"raw","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    matches_type:{"name":"matches","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    lexeme_type:{"name":"lexeme","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    hold_type:{"name":"hold","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    expect_d_type:{"name":"expect_d","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser"},
	    omit_type:{"name":"omit","blockgenerator":createSingleStatementInputBlock,"codegenerator":args_parser_generator,"check":"parser","msg0":"Omit %1"},
	    permutation_type:{"name":"permutation","blockgenerator":createParserBlock,"codegenerator":args_parserarray_generator},
	    alternative_type:{"name":"alternative","blockgenerator":createParserBlock,"codegenerator":args_parserarray_generator},
	    sequence_type:{"name":"sequence","blockgenerator":createParserBlock,"codegenerator":args_parserarray_generator},
	    sequential_or_type:{"name":"sequential_or","blockgenerator":createParserBlock,"codegenerator":args_parserarray_generator},
	    attr_type:{"name":"attr","blockgenerator":createSingleValueInputBlock,"codegenerator":undone_generator},
	    lit_type:{"name":"lit","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    ruleref_type:{"name":"ruleref","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    byte_type:{"name":"byte","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    big_word_type:{"name":"big_word","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    big_dword_type:{"name":"big_dword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    big_qword_type:{"name":"big_qword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    little_word_type:{"name":"little_word","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    little_dword_type:{"name":"little_dword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    little_qword_type:{"name":"little_qword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    dword_type:{"name":"dword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    qword_type:{"name":"qword","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    word_type:{"name":"word","blockgenerator":createSingleValueInputBlock,"codegenerator":args_binary_generator,"check":["integer","integer_all"]},
	    big_bin_double_type:{"name":"big_bin_double","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    big_bin_float_type:{"name":"big_bin_float","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    little_bin_double_type:{"name":"little_bin_double","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    little_bin_float_type:{"name":"little_bin_float","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    bin_double_type:{"name":"bin_double","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    bin_float_type:{"name":"bin_float","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    char_range_type:{"name":"char_range","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    char_set_type:{"name":"char_set","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    char_class_type:{"name":"char_class","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    char_type:{"name":"char","blockgenerator":createSingleValueInputBlock,"codegenerator":args_char_generator, "check":"character"},
	    repeat_type:{"name":"repeat","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    rule_type:{"name":"rule","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    grammar_type:{"name":"grammar","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    bin_type:{"name":"bin","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":"integer"},
	    bool_type:{"name":"bool","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    hex_type:{"name":"hex","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"]},
	    oct_type:{"name":"oct","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"]},
	    ushort_type:{"name":"ushort","blockgenerator":createSingleValueInputBlock,"codegenerator":undone_generator,"check":["integer","integer_all"],"msg0":"unsigned short: %1"},
	    uint_type:{"name":"uint","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"unsigned integer: %1"},
	    ulong_type:{"name":"ulong","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"unsigned long: %1"},
	    ulong_long_type:{"name":"ulong_long","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"unsigned long long: %1"},
	    short_type:{"name":"short","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"short: %1"},
	    int_type:{"name":"int","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"integer: %1"},
	    long_type:{"name":"long","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"long: %1"},
	    long_long_type:{"name":"long_long","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"check":["integer","integer_all"],"msg0":"long long: %1"},
	    float_type:{"name":"float","blockgenerator":createSingleValueInputBlock,"codegenerator":args_float_generator,"check":"float"},
	    long_double_type:{"name":"long_double","blockgenerator":createSingleValueInputBlock,"codegenerator":args_float_generator,"check":"float"},
	    double_type:{"name":"double","blockgenerator":createSingleValueInputBlock,"codegenerator":args_float_generator,"check":"float"},
	    string_type:{"name":"string","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    symbols_type:{"name":"symbols","blockgenerator":createParserBlock,"codegenerator":undone_generator},
	    advance_type:{"name":"advance","blockgenerator":createSingleValueInputBlock,"codegenerator":args_integer_generator,"msg0":"advance input by %1", "check":"integer"}
	};

  	var blocks = [];

  	for (bkyType in generators) {
  		blocks.push(generators[bkyType]['blockgenerator'](bkyType));
  	}

  	Blockly.defineBlocksWithJsonArray(blocks);

	for (var bkyType in generators) {
		Blockly.PHP[bkyType] = generators[bkyType]['codegenerator'];
	}

	Blockly.PHP['integer_all_type'] = function(block) {
		return [ "null", Blockly.PHP.ORDER_NONE];
	};

	Blockly.PHP['float_all_type'] = function(block) {
		return [ "null", Blockly.PHP.ORDER_NONE];
	};

	Blockly.PHP['char_all_type'] = function(block) {
		return [ "null", Blockly.PHP.ORDER_NONE];
	};

	Blockly.PHP['charparser'] = function(block) {
		var variable_charparvarname = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('charParVarName'), Blockly.Variables.NAME_TYPE);
		var value_charparatt = Blockly.PHP.valueToCode(block, 'charParAtt',
				Blockly.PHP.ORDER_ATOMIC);
		// TODO: Assemble PHP into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.PHP['rule'] = function(block) {
		var variable_rulename = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('ruleName'), Blockly.Variables.NAME_TYPE);
		var statements_ruleparser = Blockly.PHP.statementToCode(block,
				'ruleParser');
		// TODO: Assemble PHP into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.PHP['grammar'] = function(block) {
		var variable_name = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('name'), Blockly.Variables.NAME_TYPE);
		var variable_startrulename = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('startRuleName'), Blockly.Variables.NAME_TYPE);
		var statements_grammarparser = Blockly.PHP.statementToCode(block,
				'grammarParser');
		// TODO: Assemble PHP into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.PHP['rulereference'] = function(block) {
		var variable_rulename = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('ruleName'), Blockly.Variables.NAME_TYPE);
		// TODO: Assemble PHP into code variable.
		var code = '...;\n';
		return code;
	};

	Blockly.PHP['variables_set_panda'] = function(block) {
		var variable_name = Blockly.PHP.variableDB_.getName(block
				.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
		var value_name = Blockly.PHP.valueToCode(block, 'NAME',
				Blockly.PHP.ORDER_ATOMIC);
		// TODO: Assemble PHP into code variable.
		var code = '...;\n';
		return code;
	};


	Blockly.PHP['char_value_type'] = function(block) {
		var text_charvalatt = block.getFieldValue('charValAtt');
		var code = text_charvalatt;
		// TODO: Change ORDER_NONE to the correct strength.
		return [code, Blockly.PHP.ORDER_NONE];
	};
}

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
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
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  document.getElementById('title').textContent = MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
      window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="../../msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);
