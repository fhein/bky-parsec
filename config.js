var Config = {};

Config.createBlock = function(setup) {
    this.jbb.create(setup);
    var proto = setup.proto;
    switch(proto) {
        case 'no_arguments':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_dummy'});
            break;

        case 'single_parser':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'input_statement',check:'parser'}, '%%');
            break;

        case 'dual_parser':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'input_statement',check:'parser'}, '%%');
            break;

        case 'single_text_field':
            // @todo: Handle different default values
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_input', text:'a'})
            break;

        case 'single_number_field':
            // @todo: Handle different default values
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_number', value:0})
            break;

        case 'single_integer_value':
            // @todo: Handle different default values
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value',check:['integer_input', 'integer_all']})
//                .inputsInline(true);
            break;

        case 'dual_text_field':
            // @todo: Handle different default values
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_input', text:'a'})
                .addInput(0, {type:'field_input',text:'9'})
            break;

        case 'char_range':
            this.jbb
                .addInput(0, {type:'field_input',text:'0'})
                .addInput(0, {type:'field_input',text:'9'})
                .addParserConnections();
            break;

        case 'char_class':
            this.jbb
                .addInput(0, {type:'field_dropdown',
                    options: [
                        ['alpha', 'alpha'],
                        ['digit', 'digit'],
                        ['alnum', 'alnum'],
                        ['xdigit', 'xdigit'],
                        ['punct', 'punct'],
                        ['space', 'space'],
                        ['blank', 'blank'],
                        ['cntrl', 'cntrl'],
                        ['lower', 'lower'],
                        ['upper', 'upper'],
                        ['graph', 'graph'],
                        ['print', 'print'],
                ]})
                .addParserConnections();
            break;

        case 'integer_accept_all':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value',check:'integer_select'}, '%% %message%')
                .addInput(0, {type:'input_value',check:['integer_input', 'integer_all']}, '%%')
                .inputsInline(true)
                .setExtensions(['onchange_stack','onchange_warning_example', 'onchange_restore_default_colour']);
            break;

        case 'binary_accept_all':
            var type = proto.substr(0,proto.indexOf('_'));
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value',check:[type + '_input', type + '_all']})
            break;

        case 'no_skip':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .inputsInline(true);
            break;


        case 'binary_input':
        case 'float_input':
        case 'integer_input':
            this.jbb
                .addInput(0, {type:'field_number',value:123}, '%%')
                .setOutput(proto);
            break;


        // note: code generators are different for the next both
        case 'integer_digits_input':
        case 'integer_range_input':
            this.jbb
                .addInput(0, {type:'field_number',value:1})
                .addInput(0, {type:'field_number',value:3})
                .setOutput('integer_input')
                .setExtensions(['onchange_stack', 'onchange_get_parent_colour']);
            break;

        case 'string':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_input',text:'string'})
                .inputsInline(true);
            break;

        case 'repeat':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value', check:'repeat_input'})
                .addInput(0, {type:"input_statement", check:"parser"},'%%')
            break;

        case 'repeat_exactly_input':
            this.jbb
                .addInput(0, {type:"field_number", value:2},'%% %message%')
                .setOutput('repeat_input')
                .inputsInline(true);
            break;

        case 'repeat_min_input':
            this.jbb
                .addInput(0, {type:"input_dummy"},'%% %message%')
                .addInput(1, {type:"field_number", value:2},'%% %message%')
                .setOutput('repeat_input')
                .inputsInline(true);
            break;

        case 'repeat_min_max_input':
            this.jbb
                .addInput(0, {type:"input_dummy"},'%% %message%')
                .addInput(1, {type:"field_number", value:2},'%% %message%')
                .addInput(2, {type:"input_dummy"},'%% %message%')
                .addInput(3, {type:"field_number", value:2},'%% %message%')
                .setOutput('repeat_input')
                .inputsInline(true);
            break;

        case 'float':
        case 'integer':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value',check:proto})
                .inputsInline(true)
                .setExtensions(['onchange_stack', 'onchange_set_parent_colour']);
            break;

        case 'binary':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_dropdown',
                    options: [
                        ['(assume little endian byte order)', 'little_'],
                        ['(assume native endian byte order)', ''],
                        ['(assume big endian byte order)', 'big_'],
                ]}, '%message% %%')
                .addInput(0,{type:'input_value', check:['binary_input', 'binary_all']}, '%%')
            break;

        case 'integer_field':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'field_number',value:123})
                .inputsInline(true);
            break;

        case 'accept_all':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value'})
                .inputsInline(true);
            break;


        case 'grammar':
            this.jbb
                .addInput(0, {type:'field_input', text:'new grammar'})
                .addInput(1,{type:'input_dummy'})
                .addInput(1,{type:'input_statement', check:'reference'}, '%%')
                .addInput(2,{type:'field_dropdown',options:[['hello','hello'], ['world', 'world']]});
            break;

        case 'rule':
            this.jbb
                .addInput(0, {type:'field_input', text:'new rule'})
                .addInput(1,{type:'input_dummy'})
                .addInput(1,{type:'input_statement',check:'parser'},  '%%');
            break;

        case 'ref':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_dummy'})
                .addInput(1, {type:'field_dropdown', options:[['hello','hello'], ['world', 'world']]})
            break;

//        case 'binary_all':
        case 'char_all':
//        case 'integer_all':
        case 'float_all':
        case 'preskipper_all':
            this.jbb
                .addInput(0, {type:'input_dummy'}, '%%')
                .setOutput(proto)
                .setExtensions(['onchange_stack', 'onchange_get_parent_colour', /*'onchange_became_topblock'*/]);
            break;

        case 'integer_select':
            this.jbb
                .addInput(0, {type:'input_dummy'})
                .setOutput(proto)
                .setExtensions(['test', 'onchange_stack', 'use_parent_tooltip', 'onchange_set_parent_colour', /*'onchange_became_topblock'*/]);
            break;

        default:
            this.jbb
                .addInput(0, {type:'input_dummy'})
                .setOutput(proto);
            break;
     }
     return this.jbb.get();
}



Config.shadows = {
        'allNullShadow':     [['value','PARAM1','shadow','integer_all_type']],

        'byteShadow':        [['value', 'PARAM1', 'shadow', 'binary_input_type'],
                              ['value', 'PARAM1', 'block', 'binary_all_type']],

        'floatShadow':       [['value', 'PARAM1', 'shadow', 'float_input_type'],
                              ['value', 'PARAM1', 'block', 'float_all_type']],

        'binaryShadow':      [['value', 'PARAM2', 'block', 'binary_all_type']],

        'integerShadow':     [['value', 'PARAM1', 'block', 'integer_all_type']],

        'nonDecShadow':      [['value', 'PARAM1', 'shadow', 'nd_input_type'],
                              ['value', 'PARAM1', 'block', 'nd_all_type']],

//        'preSkipperShadow':  [['value', 'PARAM1', 'shadow', 'preskipper_type'],
//                              ['value', 'PARAM1', 'block', 'preskipper_all_type']],
}

Config.categories = [
    {
        "ref": "catRule",
        "proto": "undone",
        "generator": "undone_generator",
        "blocks": [
          {
            "type": "rule_type",
            "proto": "rule",
            "generator": "undone_generator",
            "data": "rule",
            "name": "rule"
          },
          {
            "type": "grammar_type",
            "proto": "grammar",
            "generator": "undone_generator",
            "data": "grammar",
            "name": "grammar"
          },
          {
            "type": "reference_type",
            "proto": "ref",
            "generator": "undone_generator",
            "name": "reference"
          }
        ]
      },
      {},
      {
        "ref": "catDirective",
        "proto": "single_parser",
        "generator": "single_parser",
        "blocks": [
            {
                "type": "expect_type",
                "generator": "single_parser",
                "data": "expect",
                "name": "expect"
          },
          {
              "type": "raw_type",
              "generator": "single_parser",
              "data": "raw",
              "name": "raw"
          },
          {
              "type": "omit_type",
              "generator": "single_parser",
              "data": "omit",
              "name": "omit"
          },
          {
              "type": "no_case_type",
              "generator": "single_parser",
              "data": "no_case",
              "name": "no_case"
          },
          {
            "type": "matches_type",
            "generator": "single_parser",
            "data": "matches",
            "name": "matches"
          },
//          {
//              "type": "hold_type",
//              "generator": "single_parser",
//              "data": "hold",
//              "name": "hold"
//          },
        ]
      },
      {},
      {
          "ref": "catCast",
          "proto": "single_parser",
          "generator": "single_parser",
          "blocks": [
              {
                  "type": "as_string_type",
                  "generator": "single_parser",
                  "data": "as_string",
                  "name": "as_string"
              },
          ]
      },
      {},
      {
        "ref": "catLoops",
        "proto": "single_parser",
        "generator": "single_parser",
        "blocks": [
          {
              "type": "sequence_type",
              "generator": "undone_generator",
              "data": "sequence",
              "name": "sequence"
          },
          {
            "type": "kleene_star_type",
            "generator": "single_parser",
            "data": "kleene",
            "name": "kleene_star"
          },
          {
            "type": "kleene_plus_type",
            "generator": "single_parser",
            "data": "plus",
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
            "generator": "dual_parser_generator",
            "data": "list",
            "name": "list"
          },
          {
            "type": "repeat_type",
            "proto": "repeat",
            "generator": "repeat_generator",
            "data": "repeat",
            "name": "repeat"
          },
          {
              "type": "repeat_exactly_type",
              "proto": "repeat_exactly_input",
              "generator": "repeat_exactly_generator",
              "data": "repeat",
              "name": "repeat_exactly"
          },
          {
              "type": "repeat_min_type",
              "proto": "repeat_min_input",
              "generator": "repeat_min_generator",
              "data": "repeat",
              "name": "repeat_min"
          },
          {
              "type": "repeat_min_max_type",
              "proto": "repeat_min_max_input",
              "generator": "repeat_min_max_generator",
              "data": "repeat",
              "name": "repeat_min_max"
          },
        ]
      },
      {
        "ref": "catPredicate",
        "proto": "single_parser",
        "generator": "single_parser",
        "blocks": [
          {
            "type": "alternative_type",
            "generator": "dual_parser_generator",
            "data": "alternative",
            "name": "alternative"
          },
          {
              "type": "difference_type",
              "proto": "dual_parser",
              "generator": "undone_generator",
              "data": "difference",
              "name": "difference"
          },
          {
              "type": "permutation_type",
              "generator": "undone_generator",
              "data": "permutation",
              "name": "permutation"
          },
          {
              "type": "sequential_or_type",
              "generator": "undone_generator",
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
        "generator": "undone_generator",
        "blocks": [
          {
              "type": "lexeme_type",
              "generator": "no_skip_generator",
              "data": "lexeme",
              "name": "lexeme"
          },
          {
              "type": "no_skip_type",
              "generator": "no_skip_generator",
              "data": "no_skip",
              "name": "no_skip"
          },
          {
            "type": "skipper_type",
            "proto": "dual_parser",
            "generator": "undone_generator",
            "data": "skip",
            "name": "skipper"
          },
          {
            "type": "skip_type",
            "proto": "single_parser",
            "generator": "dual_parser_generator",
            "data": "skip",
            "name": "skip"
          },
        ]
      },
      {},
      {
        "ref": "catString",
        "generator": "undone_generator",
        "blocks": [
          {
            "type": "string_type",
            "proto": "string",
            "generator": "single_text_field",
            "data": "string",
            "name": "string"
          },
          {
            "type": "lit_type",
            "proto": "string",
            "generator": "single_text_field",
            "data": "lit",
            "name": "lit"
          },
          {
            "type": "symbols_type",
            "generator": "undone_generator",
            "data": "symbols",
            "name": "symbols"
          }
        ]
      },
      {
        "ref": "catChar",
        "proto": "char_class_input",
        "blocks": [
          {
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
//          {
//            "type": "alpha_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "alpha",
//            "name": "alpha"
//          },
//          {
//              "type": "digit_type",
//              "proto": "no_arguments",
//              "generator": "no_argument",
//              "data": "digit",
//              "name": "digit"
//          },
//          {
//            "type": "alnum_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "alnum",
//            "name": "alnum"
//          },
//          {
//              "type": "xdigit_type",
//              "proto": "no_arguments",
//              "generator": "no_argument",
//              "data": "xdigit",
//              "name": "xdigit"
//          },
//          {
//            "type": "lower_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "lower",
//            "name": "lower"
//          },
//          {
//            "type": "graph_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "graph",
//            "name": "graph"
//          },
//          {
//            "type": "upper_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "upper",
//            "name": "upper"
//          },
//          {
//            "type": "punct_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "punct",
//            "name": "punct"
//          },
//          {
//            "type": "print_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "print",
//            "name": "print"
//          },
//          {
//            "type": "cntrl_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "cntrl",
//            "name": "cntrl"
//          },
//          {
//            "type": "space_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "space",
//            "name": "space"
//          },
//          {
//            "type": "blank_type",
//            "proto": "no_arguments",
//            "generator": "no_argument",
//            "data": "blank",
//            "name": "blank"
//          }
        ]
      },
      {},
      {
        "ref": "catBoolean",
        "blocks": [
          {
            "type": "bool_type",
            "proto": "undone",
            "generator": "undone_generator",
            "data": "bool",
            "name": "bool"
          },
          {
            "type": "true_type",
            "generator": "no_argument",
            "proto":"no_arguments",
            "data": "true",
            "name": "true"
          },
          {
            "type": "false_type",
            "generator": "no_argument",
            "proto":"no_arguments",
            "data": "false",
            "name": "false"
          }
        ]
      },
      {
        "ref": "catInteger",
        "proto": "integer_select",
        "blocks": [
//          {
//            "type": "integer_type",
//            "proto": "integer_accept_all",
//            "generator": "integer_generator",
//            "name": "integer"
//          },
          {
            "type": "signed_integer_type",
            "proto": "single_integer_value",
            "shadow": "integerShadow",
            "generator": "no_argument",
            "data": "int",
            "name": "signed_integer"
          },
          {
            "type": "unsigned_integer_type",
            "proto": "single_integer_value",
            "shadow": "integerShadow",
            "generator": "no_argument",
            "data": "int",
            "name": "unsigned_integer"
          },
          {
            "type": "floating_point_type",
            "proto": "single_integer_value",
            "shadow": "integerShadow",
            "generator": "no_argument",
            "data": "float",
            "name": "floating_point"
          },
          {
            "type": "bin_type",
            "proto": "single_integer_value",
            "generator": "no_argument",
            "shadow": "integerShadow",
            "data": "bin",
            "name": "bin"
          },
          {
            "type": "oct_type",
            "proto": "single_integer_value",
            "shadow": "integerShadow",
            "generator": "no_argument",
            "data": "oct",
            "name": "oct"
          },
          {
            "type": "hex_type",
            "proto": "single_integer_value",
            "shadow": "integerShadow",
            "generator": "no_argument",
            "data": "hex",
            "name": "hex"
          },
          {
              "type": "integer_all_type",
              "proto": "integer_all",
              "generator": "integer_all_generator",
              "name": "integer_all"
          },
          {
              "type": "integer_input_type",
              "proto": "integer_input",
              "generator": "integer_input_generator",
              "data": "char",
              "name": "integer_input"
          },
          {
              "type": "integer_range_input_type",
              "proto": "integer_range_input",
              "generator": "integer_range_input_generator",
              "data": "char",
              "name": "integer_range_input"
          },
          {
              "type": "integer_digits_input_type",
              "proto": "integer_digits_input",
              "generator": "integer_digits_input_generator",
              "data": "char",
              "name": "integer_digits_input"
          },
//          {
//            "type": "ushort_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "ushort",
//            "name": "ushort_select"
//          },
//          {
//            "type": "uint_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "uint",
//            "name": "uint_select"
//          },
//          {
//            "type": "ulong_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "ulong",
//            "name": "ulong_select"
//          },
//          {
//            "type": "ulonglong_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "ulonglong",
//            "name": "ulonglong_select"
//          },
//          {
//            "type": "short_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "short",
//            "name": "short_select"
//          },
//          {
//            "type": "int_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "int",
//            "name": "int_select"
//          },
//          {
//            "type": "long_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "long",
//            "name": "long_select"
//          },
//          {
//            "type": "longlong_select_type",
//            "proto": "single_integer_value",
//            "generator": "no_argument",
//            "data": "longlong",
//            "name": "longlong_select"
//          }
        ]
      },
      {},
      {
        "ref": "catBinary",
        "shadow": "binaryShadow",
        "proto": "binary",
        "blocks": [
          {
            "type": "byte_type",
            "proto": "binary_accept_all",
            "shadow": "byteShadow",
            "generator": "byte_generator",
            "data": "byte",
            "name": "byte"
          },
          {
            "type": "word_type",
            "generator": "binary_generator",
            "data": "word",
            "name": "word"
          },
          {
            "type": "dword_type",
            "generator": "binary_generator",
            "data": "dword",
            "name": "dword"
          },
          {
            "type": "qword_type",
            "generator": "binary_generator",
            "data": "qword",
            "name": "qword"
          },
          {
            "type": "bin_float_type",
            "generator": "binary_generator",
            "data": "bin_float",
            "name": "bin_float"
          },
          {
            "type": "bin_double_type",
            "generator": "binary_generator",
            "data": "bin_double",
            "name": "bin_double"
          },
          {
              "type": "binary_all_type",
              "proto": "binary_all",
              "shadow": "none",
              "generator": "integer_all_generator",
              "name": "binary_all"
          },
          {
              "type": "binary_input_type",
              "proto": "binary_input",
              "shadow": "none",
              "generator": "integer_input_generator",
              "name": "binary_input"
          },
        ]
      },
      {},
      {
        "ref": "catAuxiliary",
        "blocks": [
          {
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
            "generator": "undone_generator",
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
            "proto": "integer_field",
            "generator": "advance_generator",
            "data": "advance",
            "name": "advance"
          }
        ]
      }
    ];

Config.getBlocks = function() {
    var json = [];
    this.extensions = [];
    for (var cat of Config.categories) {
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
            setup.generator = block['generator'] ? block['generator'] : cat['generator'] ? cat['generator'] : 'undone_generator';
            var jsonBlock = this.createBlock(setup);
            json.push(jsonBlock);
            if (jsonBlock.extensions) {
                this.extensions = [... new Set([...jsonBlock.extensions, ...this.extensions])];
            }

//            if (proto === 'float_accept_all') {
//                console.log(builder.createBlock(bType, proto));
//            }
        }
    }
    return json;
}

Config.setupMessages = function() {
    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name='%{BKY_CATLOGIC}'>`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    var addBlockMessage = function(mkey, topic) {
        key = mkey.substr(5);
        len = key.length-topic.length;
        if (key.indexOf(topic) === len) {
            key = key.substr(0,len).toUnderScore().toUpperCase() + '_' + topic.toUpperCase();
            Blockly.Msg[key] = MSG[mkey];
            return true;
        }
        return false;
    }

    for (var messageKey in MSG) {
        if (messageKey.indexOf('cat') == 0) {
            if (messageKey.indexOf('Hue') === messageKey.length-3) {
                key = messageKey.substr(0,messageKey.length-3);
                key = key.toUpperCase()+'_HUE';
                Blockly.Msg[key] = MSG[messageKey];
            } else {
                Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
            }
        } else if (messageKey.indexOf('block') == 0) {
            if (addBlockMessage(messageKey, 'Tooltip')) {
                continue;
            };
            if (addBlockMessage(messageKey, 'HelpUrl')) {
                continue;
            };
            if (addBlockMessage(messageKey, 'Title')) {
                continue;
            }
            // todo: ouchn
            if (addBlockMessage(messageKey, 'Msg1')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg2')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg3')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg4')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg5')) {
                continue;
            }
        }
    }
}

Config.createSubs = function(config) {
    var xml = '';
    for (var v of config) {
        xml += '<' + v[0] + ' name="' + v[1] + '"><' + v[2] + ' type="' + v[3] + '"></' + v[2] + '></value>'
    }
    return xml;
}

Config.mergeGenerators = function() {
    var g = Generator.generators;
    console.log(g);
    for (var cat of Config.categories) {
        if (Object.keys(cat).length === 0) {
            continue;
        }
        var blocks = cat.blocks;
        for (var block of blocks) {
            block.name = block.type.substr(0,block.type.length-5);
        }
    }
    console.log(JSON.stringify(Config.categories, null, 2));
}

Config.setup = function() {
//    this.mergeGenerators();
    this.jbb = new JsonBlockBuilder();
    this.setupMessages();
    return {
        toolbox: this.getToolbox(),
        blocks: this.getBlocks(),
        extensions: this.extensions
    };
}

Config.blockIdx = {};

Config.getToolbox = function() {
    // generate the toolbox XML
    toolbox = '<xml>';
    var blockIdx = 0;
    for (var cat of Config.categories) {
        if (Object.keys(cat).length === 0) {
            toolbox += '<sep></sep>';
            continue;
        }
        var ref = cat.ref.toUpperCase();
        var colour = Blockly.Msg[ref+'_HUE'];
        toolbox += '<category name="'+ '%{BKY_' + ref + '}"  colour="'+ '%{BKY_' + ref + '_HUE}' + '">';
        var blocks = cat.blocks;
        for (var block of blocks) {
            var bType = block.type;
            var colourKey = bType.substr(0,bType.length-5).toUpperCase()+'_HUE';
            Blockly.Msg[colourKey] = block.colour ? block.colour : colour;
            toolbox += '<block type="' + bType + '">';
            var data = {
                data: block['data'] ? block['data'] : cat['data'] ? cat['data'] : '',
                generator: block['generator'] ? block['generator'] : cat['generator'] ? cat['generator'] : 'undone_generator',
            }
            if (data.generator === 'undone_generator') {
                console.log(bType);
            }
            Extensions.addParserGeneratorAssoc(bType,data);
            this.blockIdx[bType] = blockIdx++;

            var shadow = block['shadow'] ? block['shadow'] : cat['shadow'] ? cat['shadow'] : 'none';
            if (shadow !== 'none') {
                toolbox += this.createSubs(Config.shadows[shadow]);
            }
            toolbox += '</block>';
        }
        toolbox += '</category>';
    }
    toolbox +='</xml>';
    return toolbox;
};

