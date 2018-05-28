var Config = (function(Config, mxcParsec, undefined) {

  Config.setup = function() {
    // this.mergeGenerators();
    setupMessages();
    return {
      toolbox: getToolbox(),
      blocks: getBlocks(),
      extensions: extensions
    };
  }

  var defaultExtensions = ['register_generator'];
  var extensions = [];

  var shadows = {
    'byteShadow': [
      ['value', 'PARAM1', 'shadow', 'binary_input_type'],
      ['value', 'PARAM1', 'block', 'binary_all_type']
    ],

    'binaryShadow': [
      ['value', 'PARAM2', 'shadow', 'binary_input_type'],
      ['value', 'PARAM2', 'block', 'binary_all_type']
    ],

    'integerShadow': [
      ['value', 'PARAM1', 'shadow', 'integer_input_type'],
      ['value', 'PARAM1', 'block', 'integer_all_type']
    ],
  }

  var categories = [{
      "ref": "catRule",
      "proto": "undone",
      "generator": "undone",
      "blocks": [{
          "type": "rule_type",
          "proto": "rule",
          "generator": "rule",
          "data": "rule",
          "name": "rule"
        },
        {
          "type": "grammar_type",
          "proto": "grammar",
          "generator": "grammar",
          "data": "grammar",
          "name": "grammar"
        },
        {
          "type": "reference_type",
          "proto": "reference",
          "generator": "single_text_field",
          "data": "reference",
          "name": "reference"
        }
      ]
    },
    {},
    {
      "ref": "catDirective",
      "proto": "single_parser",
      "generator": "single_parser",
      "blocks": [{
          "type": "expect_type",
          "data": "expect",
          "name": "expect"
        },
        {
          "type": "raw_type",
          "data": "raw",
          "name": "raw"
        },
        {
          "type": "omit_type",
          "data": "omit",
          "name": "omit"
        },
        {
          "type": "no_case_type",
          "data": "no_case",
          "name": "no_case"
        },
        {
          "type": "matches_type",
          "data": "matches",
          "name": "matches"
        },
      ]
    },
    {},
    {
      "ref": "catCast",
      "proto": "single_parser",
      "generator": "single_parser",
      "blocks": [{
        "type": "as_string_type",
        "generator": "single_parser",
        "data": "as_string",
        "name": "as_string"
      }, ]
    },
    {},
    {
      "ref": "catLoops",
      "proto": "single_parser",
      "generator": "single_parser",
      "blocks": [{
          "type": "sequence_type",
          "generator": "array_parser",
          "data": "sequence",
          "name": "sequence"
        },
        {
          "type": "kleene_star_type",
          "generator": "single_parser",
          "data": "kleene_star",
          "name": "kleene_star"
        },
        {
          "type": "kleene_plus_type",
          "generator": "single_parser",
          "data": "kleene_plus",
          "name": "kleene_plus"
        },
        {
          "type": "optional_type",
          "generator": "single_parser",
          "data": "optional",
          "name": "optional"
        },
        {
          "type": "list_type",
          "proto": "dual_parser",
          "generator": "dual_parser",
          "data": "list",
          "name": "list"
        },
        {
          "type": "repeat_type",
          "proto": "repeat",
          "generator": "repeat",
          "data": "repeat",
          "name": "repeat"
        },
        {
          "type": "repeat_min_max_type",
          "proto": "repeat_min_max",
          "generator": "repeat_min_max",
          "data": "repeat",
          "name": "repeat_min_max"
        },
      ]
    },
    {
      "ref": "catLogic",
      "proto": "single_parser",
      "generator": "single_parser",
      "blocks": [{
          "type": "alternative_type",
          "data": "alternative",
          "name": "alternative"
        },
        {
          "type": "difference_type",
          "proto": "dual_parser",
          "generator": "dual_parser",
          "data": "difference",
          "name": "difference"
        },
        {
          "type": "permutation_type",
          "generator": "array_parser",
          "data": "permutation",
          "name": "permutation"
        },
        {
          "type": "sequential_or_type",
          "generator": "array_parser",
          "data": "sequential_or",
          "name": "sequential_or"
        },
        {
          "type": "not_type",
          "generator": "single_parser",
          "data": "not",
          "name": "not"
        },
        {
          "type": "and_type",
          "generator": "single_parser",
          "data": "and",
          "name": "and"
        }
      ]
    },
    {
      "ref": "catSkipper",
      "proto": "single_parser",
      "generator": "single_parser",
      "blocks": [{
          "type": "lexeme_type",
          "data": "lexeme",
          "name": "lexeme"
        },
        {
          "type": "no_skip_type",
          "data": "no_skip",
          "name": "no_skip"
        },
        {
          "type": "skipper_type",
          "proto": "dual_parser",
          "generator": "dual_parser",
          "data": "skip",
          "name": "skipper"
        },
        {
          "type": "skip_type",
          "proto": "single_parser",
          "data": "skip",
          "name": "skip"
        },
      ]
    },
    {},
    {
      "ref": "catString",
      "generator": "undone",
      "blocks": [{
          "type": "string_type",
          "proto": "single_text_field",
          "generator": "single_text_field",
          "data": "string",
          "name": "string"
        },
        {
          "type": "lit_type",
          "proto": "single_text_field",
          "generator": "single_text_field",
          "data": "lit",
          "name": "lit"
        },
        {
          "type": "symbols_type",
          "generator": "undone",
          "data": "symbols",
          "name": "symbols"
        }
      ]
    },
    {
      "ref": "catChar",
      "proto": "char_class_input",
      "blocks": [{
          "type": "char_all_type",
          "proto": "no_arguments",
          "generator": "no_argument",
          "data": "char",
          "name": "char_all"
        },
        {
          "type": "negate_type",
          "proto": "single_parser",
          "generator": "single_parser",
          "data": "~",
          "name": "negate"
        },
        {
          "type": "char_type",
          "proto": "single_text_field",
          "generator": "single_text_field",
          "data": "char",
          "name": "char"
        },
        {
          "type": "char_range_type",
          "proto": "char_range",
          "generator": "dual_text_field",
          "data": "char_range",
          "name": "char_range"
        },
        {
          "type": "char_set_type",
          "proto": "single_text_field",
          "generator": "single_text_field",
          "data": "char_set",
          "name": "char_set"
        },
        {
          "type": "char_class_type",
          "proto": "char_class",
          "generator": "single_text_field",
          "data": "char_class",
          "name": "char_class"
        },
      ]
    },
    {},
    {
      "ref": "catBoolean",
      "blocks": [{
          "type": "bool_type",
          "proto": "undone",
          "generator": "undone",
          "data": "bool",
          "name": "bool"
        },
        {
          "type": "true_type",
          "generator": "no_argument",
          "proto": "no_arguments",
          "data": "true",
          "name": "true"
        },
        {
          "type": "false_type",
          "generator": "no_argument",
          "proto": "no_arguments",
          "data": "false",
          "name": "false"
        }
      ]
    },
    {
      "ref": "catInteger",
      "proto": "integer_select",
      "generator": "integer",
      "blocks": [{
          "type": "signed_integer_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "int",
          "name": "signed_integer"
        },
        {
          "type": "unsigned_integer_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "uint",
          "name": "unsigned_integer"
        },
        {
          "type": "floating_point_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "float",
          "name": "floating_point"
        },
        {
          "type": "bin_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "bin",
          "name": "bin"
        },
        {
          "type": "oct_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "oct",
          "name": "oct"
        },
        {
          "type": "hex_type",
          "proto": "single_integer_value",
          "shadow": "integerShadow",
          "data": "hex",
          "name": "hex"
        },
        {
          "type": "integer_all_type",
          "proto": "integer_all",
          "generator": "integer_all",
          "name": "integer_all"
        },
        {
          "type": "integer_input_type",
          "proto": "integer_input",
          "generator": "integer_input",
          "data": "char",
          "name": "integer_input"
        },
        {
          "type": "integer_range_input_type",
          "proto": "integer_range_input",
          "generator": "integer_range_input",
          "data": "char",
          "name": "integer_range_input"
        },
        {
          "type": "integer_digits_input_type",
          "proto": "integer_digits_input",
          "generator": "integer_digits_input",
          "data": "char",
          "name": "integer_digits_input"
        },
      ]
    },
    {},
    {
      "ref": "catBinary",
      "shadow": "binaryShadow",
      "proto": "binary",
      "blocks": [{
          "type": "byte_type",
          "proto": "binary_accept_all",
          "shadow": "byteShadow",
          "generator": "byte",
          "data": "byte",
          "name": "byte"
        },
        {
          "type": "word_type",
          "generator": "binary",
          "data": "word",
          "name": "word"
        },
        {
          "type": "dword_type",
          "generator": "binary",
          "data": "dword",
          "name": "dword"
        },
        {
          "type": "qword_type",
          "generator": "binary",
          "data": "qword",
          "name": "qword"
        },
        {
          "type": "bin_float_type",
          "generator": "binary",
          "data": "bin_float",
          "name": "bin_float"
        },
        {
          "type": "bin_double_type",
          "generator": "binary",
          "data": "bin_double",
          "name": "bin_double"
        },
        {
          "type": "binary_all_type",
          "proto": "binary_all",
          "shadow": "none",
          "generator": "integer_all",
          "name": "binary_all"
        },
        {
          "type": "binary_input_type",
          "proto": "binary_input",
          "shadow": "none",
          "generator": "integer_input",
          "name": "binary_input"
        },
      ]
    },
    {},
    {
      "ref": "catAuxiliary",
      "blocks": [{
          "type": "eol_type",
          "proto": "no_arguments",
          "generator": "no_argument",
          "data": "eol",
          "name": "eol"
        },
        {
          "type": "eoi_type",
          "proto": "no_arguments",
          "generator": "no_argument",
          "data": "eoi",
          "name": "eoi"
        },
        {
          "type": "eps_type",
          "proto": "no_arguments",
          "generator": "no_argument",
          "data": "eps",
          "name": "eps"
        },
        {
          "type": "attr_type",
          "proto": "accept_all",
          "generator": "undone_statement",
          "data": "attr",
          "name": "attr"
        },
        {
          "type": "lazy_type",
          "proto": "single_parser",
          "generator": "single_parser",
          "data": "lazy",
          "name": "lazy"
        },
        {
          "type": "advance_type",
          "proto": "single_number_field",
          "generator": "advance",
          "data": "advance",
          "name": "advance"
        }
      ]
    }
  ];

  var jbb = new JsonBlockBuilder(defaultExtensions);

  var createBlock = function(setup) {
    jbb.create(setup);
    var proto = setup.proto;
    var parser = ['parser', 'reference'];

    switch (proto) {
      case 'no_arguments':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_dummy'
          });
        break;

      case 'single_parser':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_dummy'
          })
          .addInput(0, {
            type: 'input_statement',
            check: parser
          }, '%%');
        break;

      case 'dual_parser':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_dummy'
          })
          .addInput(0, {
            type: 'input_statement',
            check: parser
          }, '%%')
          .addInput(0, {
            type: 'input_dummy'
          })
          .addInput(0, {
            type: 'input_statement',
            check: parser
          }, '%%');
        break;

      case 'single_text_field':
        // @todo: Handle different default values
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'field_input',
            text: 'a'
          })
        break;

      case 'single_number_field':
        // @todo: Handle different default values
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'field_number',
            value: 0
          })
        break;

      case 'single_integer_value':
        // @todo: Handle different default values
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_value',
            check: ['integer_input', 'integer_all']
          })
        break;

      case 'char_range':
        jbb
          .addInput(0, {
            type: 'field_input',
            text: '0'
          })
          .addInput(0, {
            type: 'field_input',
            text: '9'
          })
          .addConnections(parser);
        break;

      case 'char_class':
        jbb
          .addInput(0, {
            type: 'field_dropdown',
            options: [
              ['%{BKY_ALPHA_OPTION}', 'alpha'],
              ['%{BKY_DIGIT_OPTION}', 'digit'],
              ['%{BKY_ALNUM_OPTION}', 'alnum'],
              ['%{BKY_XDIGIT_OPTION}', 'xdigit'],
              ['%{BKY_PUNCT_OPTION}', 'punct'],
              ['%{BKY_SPACE_OPTION}', 'space'],
              ['%{BKY_BLANK_OPTION}', 'blank'],
              ['%{BKY_CNTRL_OPTION}', 'cntrl'],
              ['%{BKY_LOWER_OPTION}', 'lower'],
              ['%{BKY_UPPER_OPTION}', 'upper'],
              ['%{BKY_GRAPH_OPTION}', 'graph'],
              ['%{BKY_PRINT_OPTION}', 'print'],
            ]
          })
          .addConnections(parser);
        break;

      case 'binary_accept_all':
        var type = proto.substr(0, proto.indexOf('_'));
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_value',
            check: [type + '_input', type + '_all']
          })
        break;

      case 'binary_input':
      case 'integer_input':
        jbb
          .addInput(0, {
            type: 'field_number',
            value: 123
          }, '%%')
          .setOutput(proto);
        break;

        // note: code generators are different for the next both
      case 'integer_digits_input':
      case 'integer_range_input':
        jbb
          .addInput(0, {
            type: 'field_number',
            value: 1
          })
          .addInput(0, {
            type: 'field_number',
            value: 3
          })
          .setOutput('integer_input')
        break;

      case 'repeat':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'field_dropdown',
            options: [
              ['%{BKY_REPEAT_EXACTLY_OPTION}', 'exactly'],
              ['%{BKY_REPEAT_MIN_OPTION}', 'min'],
              ['%{BKY_REPEAT_MAX_OPTION}', 'max'],
            ]
          })
          .addInput(0, {
            type: "field_number",
            value: 2
          }, '%% %message%')
          .addInput(1, {
            type: "input_statement",
            check: "parser"
          }, '%%')
        break;

      case 'repeat_min_max':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: "input_dummy"
          }, '%% %message%')
          .addInput(1, {
            type: "field_number",
            value: 2
          }, '%% %message%')
          .addInput(2, {
            type: "field_number",
            value: 2
          }, '%% %message%')
          .addInput(3, {
            type: "input_statement",
            check: "parser"
          }, '%%')
          .inputsInline(true);
        break;

      case 'binary':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'field_dropdown',
            options: [
              ['%{BKY_LITTLE_ENDIAN_OPTION}', 'little_'],
              ['%{BKY_NATIVE_ENDIAN_OPTION}', ''],
              ['%{BKY_BIG_ENDIAN_OPTION}', 'big_'],
            ]
          }, '%message% %%')
          .addInput(0, {
            type: 'input_value',
            check: ['binary_input', 'binary_all']
          }, '%%')
        break;

      case 'accept_all':
        jbb
          .addConnections(parser)
          .addInput(0, {
            type: 'input_value'
          })
          .inputsInline(true);
        break;

      case 'grammar':
        jbb
          .addInput(0, {
            type: 'field_input',
            text: 'new grammar'
          })
          .addInput(1, {
            type: 'input_dummy'
          })
          .addInput(1, {
            type: 'input_statement',
            check: 'reference'
          }, '%%')
          .addInput(2, {
            type: 'field_dropdown',
            options: [
              ['hello', 'hello'],
              ['world', 'world']
            ]
          })
          .setExtensions(['onchange_name_handler']);
        break;

      case 'rule':
        jbb
          .addInput(0, {
            type: 'field_input',
            text: 'rule1'
          })
          .addInput(1, {
            type: 'input_dummy'
          })
          .addInput(1, {
            type: 'input_statement',
            check: parser
          }, '%%')
          .setExtensions(['onchange_name_handler']);
        break;

      case 'reference':
        jbb
          .addConnections('reference')
          .addInput(0, {type:'input_dummy'})
          .setExtensions(['reference_dropdown', 'makeParserUndeletable']);
        break;

      default:
        jbb
          .addInput(0, {
            type: 'input_dummy'
          })
          .setOutput(proto);
        break;
    }
    return jbb.get();
  }

  var getBlocks = function() {
    var json = [];

    for (var cat of categories) {
      if (Object.keys(cat).length === 0) {
        continue;
      }
      var blocks = cat.blocks;
      for (var block of blocks) {
        var setup = {};
        setup.bType = block.type;
        setup.bName = block.name;
        setup.proto = block['proto'] ? block['proto'] : cat['proto'] ? cat['proto'] : 'undone';
        setup.parser = block['parser'] ? block['parser'] : cat['parser'] ? cat['parser'] : '';
        setup.generator = block['generator'] ? block['generator'] : cat['generator'] ? cat['generator'] : 'undone';
        jsonBlock = createBlock(setup);
        json.push(jsonBlock);
        if (jsonBlock.extensions) {
          extensions = [...new Set([...jsonBlock.extensions, ...extensions])];
        }

        // if (setup.proto === 'repeat_min_max') {
        // console.log(this.createBlock(setup));
        // }
      }
    }
    console.log('Extensions in use: ' + JSON.stringify(extensions));
    return json;
  }

  var setupMessages = function() {
    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name='%{BKY_CATLOGIC}'>`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary
    // that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    var addMessage = function(mkey, prefix, topic) {
      key = mkey.substr(prefix.length);
      len = key.length - topic[0].length - topic[1];
      if (key.indexOf(topic[0]) === len) {
        key = key.substr(0, len).toUnderScore().toUpperCase() + '_' + key.substr(len).toUpperCase();
        Blockly.Msg[key] = MSG[mkey];
        return true;
      }
      return false;
    }

    var topics = [
      ['Tooltip', 0],
      ['HelpUrl', 0],
      ['Msg', 1]
    ];

    for (var messageKey in MSG) {
      if (messageKey.indexOf('cat') == 0) {
        if (messageKey.indexOf('Hue') === messageKey.length - 3) {
          key = messageKey.substr(0, messageKey.length - 3);
          key = key.toUpperCase() + '_HUE';
          Blockly.Msg[key] = MSG[messageKey];
        } else {
          Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
        }
      } else if (messageKey.indexOf('block') == 0) {
        for (topic of topics) {
          if (addMessage(messageKey, 'block', topic)) {
            continue;
          };
        }
      } else if (messageKey.indexOf('dropdown') == 0) {
        if (addMessage(messageKey, 'dropdown', ['Option', 0])) {
          continue;
        }
      }
    }
  }

  var createSubs = function(config) {
    var xml = '';
    for (var v of config) {
      xml += '<' + v[0] + ' name="' + v[1] + '"><' + v[2] + ' type="' + v[3] + '"></' + v[2] + '></value>'
    }
    return xml;
  }

  var getToolbox = function() {
    // generate the toolbox XML
    toolbox = '<xml>';
    var generatorsUndone = [];
    for (var cat of categories) {
      if (Object.keys(cat).length === 0) {
        toolbox += '<sep></sep>';
        continue;
      }
      var ref = cat.ref.toUpperCase();
      var colour = Blockly.Msg[ref + '_HUE'];
      toolbox += '<category name="' + '%{BKY_' + ref + '}"  colour="' + '%{BKY_' + ref + '_HUE}' + '">';
      var blocks = cat.blocks;
      for (var block of blocks) {
        var bType = block.type;
        var colourKey = bType.substr(0, bType.length - 5).toUpperCase() + '_HUE';
        Blockly.Msg[colourKey] = block.colour ? block.colour : colour;
        toolbox += '<block type="' + bType + '">';
        var data = {
          data: block['data'] ? block['data'] : cat['data'] ? cat['data'] : '',
          generator: block['generator'] ? block['generator'] : cat['generator'] ? cat['generator'] : 'undone',
        }
        if (data.generator === 'undone') {
          generatorsUndone.push(bType);
        }
        Extensions.linkParserToGenerator(bType, data);

        var shadow = block['shadow'] ? block['shadow'] : cat['shadow'] ? cat['shadow'] : 'none';
        if (shadow !== 'none') {
          toolbox += createSubs(shadows[shadow]);
        }
        toolbox += '</block>';
      }
      toolbox += '</category>';
    }
    toolbox += '</xml>';
    console.log('Parsers without generators: ', JSON.stringify(generatorsUndone));
    return toolbox;
  };

  return Config;
})(Config || {}, mxcParsec);

console.log('Config: ', Config);
