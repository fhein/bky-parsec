/**
 * bky-parsec
 *
 * Blockly configurator for mxc-parsec parser generator
 *
 * Copyright 2018 maxence operations gmbh.
 * All rights reserved.
 *
 * http://www.maxence.de/

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
  Code.registerGenerators();
  Config.setupMessages();

  Blockly.defineBlocksWithJsonArray(Config.getBlocks());
  var toolboxXml = Blockly.Xml.textToDom(Config.getToolbox());
  Code.workspace = Blockly.inject('content_blocks',
      {
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
Code.registerGenerators = function() {
	var no_args_generator = function(block) {
		var parser = generators[block.type]["name"];
		return '["'+ parser + '", []], ';
	};

	var no_code_generator = function(block) {
	    return '';
	}

	var args_char_set_generator = function(block) {
	    return "";
	}

	var args_parser_generator = function(block) {
		// @todo: sequencer einbauen
		var parser = generators[block.type]["name"];
		var statements_param = Blockly.PHP.statementToCode(block, "PARAM");
		return '["'+ parser + '", [' + statements_param + ']], ';
	};

	var args_parser_parser_generator = function(block) {
        // @todo: sequencer einbauen
        var parser = generators[block.type]["name"];
        var statements_param1 = Blockly.PHP.statementToCode(block, 'PARAM1');
        var statements_param2 = Blockly.PHP.statementToCode(block, 'PARAM2');
        return '["'+ parser + '", [' + statements_param1 + statements_param2
        + '], ';
    };

    var args_parserarray_generator = function(block) {
        var parser = generators[block.type]["name"];
        var statements_param = Blockly.PHP.statementToCode(block, 'PARAM');
        return '["'+parser+'", [[' + statements_param + ']]], ';
    };

    var args_string_generator = function(block) {
        var parser = generators[block.type]["name"];
        var field_param = block.getFieldValue("PARAM");
        return '["' + parser + '", ["' + field_param + '"]], ';
    };

    var args_integer_generator = function(block) {
		var parser = generators[block.type]["name"];
		var value_param = Blockly.PHP.valueToCode(block, "PARAM", Blockly.PHP.ORDER_NONE);
		return '["' + parser + '", [' + value_param + ']], ';
	};

	var args_char_class_generator = function(block) {
        var parser = generators[block.type]["name"];
        var field_negate = block.getFieldValue("NEGATE");
        return '["' + parser + '", [' + field_negate.toLowerCase() + ']], ';
    }

	var args_float_generator = args_integer_generator;
	var args_binary_generator = args_integer_generator;

	var undone_generator = function(block) {
		var parser = generators[block.type]["name"];
		return "[*** " + parser + " (undone) ***]";
	};

	//////////////////////////////////////////////////////////////////////////
	// new
    var true_generator = function(block) {
        return [ "true", Blockly.PHP.ORDER_NONE ];
    }

    var false_generator = function(block) {
        return [ "false", Blockly.PHP.ORDER_NONE ];
    }

    var char_range_input_generator = function(block) {
        var parser = generators[block.type]["parser"];
        var field_from = block.getFieldValue("PARAM1");
        var field_to = block.getFieldValue("PARAM2");
        var code = '["' + parser + '", ["'+field_from+'", "'+field_to+'", ';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

    var char_class_input_generator = function(block) {
        var parser = generators[block.type]["parser"];
        var code = '["' + parser + '", [';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

    var char_set_input_generator = function(block) {
        var parser = generators[block.type]["parser"];
        var field_char_set = block.getFieldValue("PARAM1");
        var code = '["'+parser+'", ["'+field_char_set+'", ';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

    var char_all_generator = function(block) {
        var parser = generators[block.type]["parser"];
        var code = '["'+parser+'", [null, ';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

    var char_generator = function (block) {
        var negate_param = Blockly.PHP.valueToCode(block, "PARAM1", Blockly.PHP.ORDER_NONE);
        var parser = Blockly.PHP.valueToCode(block, "PARAM2", Blockly.PHP.ORDER_NONE);
        var code = parser + negate_param + ']],';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

  	var generators = {
        eol_type:{"parser":"eol","codegenerator":no_args_generator},
        eoi_type:{"parser":"eoi","codegenerator":no_args_generator},
        eps_type:{"parser":"eps","codegenerator":no_args_generator},
        true_type:{"parser":"true","codegenerator":no_args_generator},
        false_type:{"parser":"false","codegenerator":no_args_generator},
        alpha_type:{"parser":"alpha","codegenerator":char_class_input_generator},
        alnum_type:{"parser":"alnum","codegenerator":char_class_input_generator},
        digit_type:{"parser":"digit","codegenerator":char_class_input_generator},
        xdigit_type:{"parser":"xdigit","codegenerator":char_class_input_generator},
        upper_type:{"parser":"upper","codegenerator":char_class_input_generator},
        lower_type:{"parser":"lower","codegenerator":char_class_input_generator},
        graph_type:{"parser":"graph","codegenerator":char_class_input_generator},
        print_type:{"parser":"print","codegenerator":char_class_input_generator},
        punct_type:{"parser":"punct","codegenerator":char_class_input_generator},
        cntrl_type:{"parser":"cntrl","codegenerator":char_class_input_generator},
        space_type:{"parser":"space","codegenerator":char_class_input_generator},
        blank_type:{"parser":"blank","codegenerator":char_class_input_generator},
        byte_type:{"parser":"byte","codegenerator":args_binary_generator},
        dword_type:{"parser":"dword","codegenerator":args_binary_generator},
        qword_type:{"parser":"qword","codegenerator":args_binary_generator},
        word_type:{"parser":"word","codegenerator":args_binary_generator},
        bin_double_type:{"parser":"bin_double","codegenerator":args_float_generator},
        bin_float_type:{"parser":"bin_float","codegenerator":args_float_generator},
        char_set_type:{"parser":"char_set","codegenerator":args_char_set_generator},
        char_set_input_type:{"parser":"char_set","codegenerator":char_set_input_generator},
        char_range_input_type:{"parser":"char_range","codegenerator":char_range_input_generator},
        char_input_type:{"parser":"char","codegenerator":char_set_input_generator},
        char_type:{"parser":"char","codegenerator":char_generator},
        char_all_type:{"parser":"char","codegenerator":char_all_generator},
        char_range_type:{"parser":"char_range","codegenerator":undone_generator},
        as_string_type:{"parser":"as_string","codegenerator":args_parser_generator},
        no_skip_type:{"parser":"no_skip","codegenerator":args_parser_generator},
        no_case_type:{"parser":"no_case","codegenerator":args_parser_generator},
        raw_type:{"parser":"raw","codegenerator":args_parser_generator},
        matches_type:{"parser":"matches","codegenerator":args_parser_generator},
        lexeme_type:{"parser":"lexeme","codegenerator":args_parser_generator},
        hold_type:{"parser":"hold","codegenerator":args_parser_generator},
        expect_type:{"parser":"expect","codegenerator":args_parser_generator},
        omit_type:{"parser":"omit","codegenerator":args_parser_generator},
        plus_type:{"parser":"plus","codegenerator":args_parser_generator},
        kleene_type:{"parser":"kleene","codegenerator":args_parser_generator},
        optional_type:{"parser":"optional","codegenerator":args_parser_generator},
        lazy_type:{"parser":"lazy","codegenerator":args_parser_generator},
        not_type:{"parser":"not","codegenerator":args_parser_generator},
        and_type:{"parser":"and","codegenerator":args_parser_generator},
        difference_type:{"parser":"difference","codegenerator":args_parser_parser_generator},
        list_type:{"parser":"list","codegenerator":args_parser_parser_generator},
        permutation_type:{"parser":"permutation","codegenerator":args_parserarray_generator},
        alternative_type:{"parser":"alternative","codegenerator":args_parserarray_generator},
        sequence_type:{"parser":"sequence","codegenerator":args_parserarray_generator},
        sequential_or_type:{"parser":"sequential_or","codegenerator":args_parserarray_generator},
        ushort_type:{"parser":"ushort","codegenerator":args_integer_generator},
        uint_type:{"parser":"uint","codegenerator":args_integer_generator},
        ulong_type:{"parser":"ulong","codegenerator":args_integer_generator},
        ulong_long_type:{"parser":"ulong_long","codegenerator":args_integer_generator},
        short_type:{"parser":"short","codegenerator":args_integer_generator},
        int_type:{"parser":"int","codegenerator":args_integer_generator},
        long_type:{"parser":"long","codegenerator":args_integer_generator},
        long_long_type:{"parser":"long_long","codegenerator":args_integer_generator},
        bin_type:{"parser":"bin","codegenerator":args_integer_generator},
        hex_type:{"parser":"hex","codegenerator":args_integer_generator},
        oct_type:{"parser":"oct","codegenerator":args_integer_generator},
        float_type:{"parser":"float","codegenerator":args_float_generator},
        long_double_type:{"parser":"long_double","codegenerator":args_float_generator},
        double_type:{"parser":"double","codegenerator":args_float_generator},
        advance_type:{"parser":"advance","codegenerator":args_integer_generator},
        lit_type:{"parser":"lit","signature":"string","codegenerator":args_string_generator},
        string_type:{"parser":"string","signature":"string","codegenerator":args_string_generator},
        attr_type:{"parser":"attr","codegenerator":undone_generator},
        all_null_type:{"prototype":"all_null","codegenerator":no_args_generator},
        char_negate_true_type:{"prototype":"char_negate","codegenerator":true_generator},
        char_negate_false_type:{"prototype":"char_negate","codegenerator":false_generator},
        little_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        big_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        native_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        skip_type:{"parser":"skip","codegenerator":args_parser_parser_generator},
        repeat_type:{"parser":"repeat","codegenerator":undone_generator},
        bool_type:{"parser":"bool","codegenerator":undone_generator},
        symbols_type:{"parser":"symbols","codegenerator":undone_generator},
        ruleref_type:{"parser":"ruleref","codegenerator":undone_generator},
        rule_type:{"parser":"rule","codegenerator":undone_generator},
        grammar_type:{"parser":"grammar","codegenerator":undone_generator},
  	}

	for (var bkyType in generators) {
		Blockly.PHP[bkyType] = generators[bkyType]['codegenerator'];
	}

	Blockly.PHP['all_null_type'] = function(block) {
		return ["null", Blockly.PHP.ORDER_NONE];
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
