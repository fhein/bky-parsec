var Config = {};

Config.createBlock = function(setup) {
    this.jbb.create(setup);
    var proto = setup.proto;
    switch(proto) {
        case 'no_args':
            this.jbb
                .addInput(0, {type:'input_dummy'})
                .addParserConnections();
            break;

        case 'char':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value', check:'char_negate'}, '%% %message%')
                .addInput(0, {type:'input_value', check:['char_input', 'char_all']}, '%%')
                .inputsInline(true);
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
        case 'float_accept_all':
            var type = proto.substr(0,proto.indexOf('_'));
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value',check:[type + '_input', type + '_all']})
                .inputsInline(true);
            break;

        case 'char_input':
            this.jbb
                .addInput(0, {type:'field_input',text:'a',check:'string'}, '%%')
                .setOutput('char_input');
            break;

        case 'no_skip':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_value', check:['preskipper', 'preskipper_all']})
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

        case 'char_set_input':
            this.jbb
                .addInput(0, {type:'field_input',text:'A-Z0-9'})
                .setOutput('char_input');
            break;

        case 'char_range_input':
            this.jbb
                .addInput(0, {type:'field_input',text:'0'})
                .addInput(0, {type:'field_input',text:'9'})
                .setOutput('char_input');
            break;

        case 'char_class_input':
            this.jbb
                .addInput(0, {type:'input_dummy'})
                .setOutput('char_input');
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
                .addInput(0,{type:'input_value', check:['binary_input', 'binary_all']})
                .addInput(0,{type:'input_value', check:'endianness'}, '%%')
                .inputsInline(true);
            break;

        case 'dual_parser':
            this.jbb
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')

                // intentional fall through
        case 'single_parser':
            this.jbb
                .addParserConnections()
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'input_statement',check:'parser'}, '%%');
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
                .addInput(0, {type:'input_dummy'})
                .addInput(0, {type:'field_input', text:'new grammar'})
                .addInput(1,{type:'input_dummy'})
                .addInput(1,{type:'input_statement', check:'reference'}, '%%')
                .addInput(0,{type:'field_dropdown',options:[['hello','hello'], ['world', 'world']]});
            break;

        case 'rule':
            this.jbb
                .addInput(0, {type:'input_dummy'})
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

        case 'binary_all':
        case 'char_all':
        case 'integer_all':
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

        'negateShadow':      [['value', 'PARAM1', 'shadow', 'char_negate_true_type'],
                              ['value', 'PARAM1', 'block', 'char_negate_false_type'],
                              ['value', 'PARAM2', 'shadow', 'char_set_input_type'],
                              ['value', 'PARAM2', 'block', 'char_all_type']],

        'byteShadow':        [['value', 'PARAM1', 'shadow', 'binary_input_type'],
                              ['value', 'PARAM1', 'block', 'binary_all_type']],

        'floatShadow':       [['value', 'PARAM1', 'shadow', 'float_input_type'],
                              ['value', 'PARAM1', 'block', 'float_all_type']],

        'binaryShadow':      [['value', 'PARAM1', 'shadow', 'binary_input_type'],
                              ['value', 'PARAM1', 'block', 'binary_all_type'],
                              ['value', 'PARAM2', 'shadow', 'native_endian_type'],
                              ['value', 'PARAM2', 'block', 'little_endian_type']],

        'integerShadow':     [['value', 'PARAM1', 'block', 'dec_select_type'],
                              ['value', 'PARAM2', 'shadow', 'integer_range_input_type'],
                              ['value', 'PARAM2', 'block', 'integer_all_type']],

        'nonDecShadow':      [['value', 'PARAM1', 'shadow', 'nd_input_type'],
                              ['value', 'PARAM1', 'block', 'nd_all_type']],

        'preSkipperShadow':  [['value', 'PARAM1', 'shadow', 'preskipper_type'],
                              ['value', 'PARAM1', 'block', 'preskipper_all_type']],
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
            "parser": "rule",
            "name": "rule"
          },
          {
            "type": "grammar_type",
            "proto": "grammar",
            "generator": "undone_generator",
            "parser": "grammar",
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
        "generator": "single_parser_generator",
        "blocks": [
          {
            "type": "matches_type",
            "generator": "single_parser_generator",
            "parser": "matches",
            "name": "matches"
          },
          {
            "type": "omit_type",
            "generator": "single_parser_generator",
            "parser": "omit",
            "name": "omit"
          },
          {
            "type": "hold_type",
            "generator": "single_parser_generator",
            "parser": "hold",
            "name": "hold"
          },
          {
            "type": "as_string_type",
            "generator": "single_parser_generator",
            "parser": "as_string",
            "name": "as_string"
          },
          {
            "type": "no_case_type",
            "generator": "single_parser_generator",
            "parser": "no_case",
            "name": "no_case"
          },
          {
            "type": "expect_type",
            "generator": "single_parser_generator",
            "parser": "expect",
            "name": "expect"
          },
          {
            "type": "raw_type",
            "generator": "single_parser_generator",
            "parser": "raw",
            "name": "raw"
          },
          {
            "type": "repeat_type",
            "proto": "undone",
            "generator": "undone_generator",
            "parser": "repeat",
            "name": "repeat"
          }
        ]
      },
      {
        "ref": "catLoops",
        "proto": "single_parser",
        "generator": "single_parser_generator",
        "blocks": [
          {
            "type": "kleene_type",
            "generator": "single_parser_generator",
            "parser": "kleene",
            "name": "kleene"
          },
          {
            "type": "plus_type",
            "generator": "single_parser_generator",
            "parser": "plus",
            "name": "plus"
          },
          {
            "type": "optional_type",
            "generator": "single_parser_generator",
            "parser": "optional",
            "name": "optional"
          },
          {
            "type": "alternative_type",
            "generator": "dual_parser_generator",
            "parser": "alternative",
            "name": "alternative"
          },
          {
            "type": "sequence_type",
            "generator": "undone_generator",
            "parser": "sequence",
            "name": "sequence"
          },
          {
            "type": "permutation_type",
            "generator": "undone_generator",
            "parser": "permutation",
            "name": "permutation"
          },
          {
            "type": "sequential_or_type",
            "generator": "undone_generator",
            "parser": "sequential_or",
            "name": "sequential_or"
          },
          {
            "type": "difference_type",
            "proto": "dual_parser",
            "generator": "undone_generator",
            "parser": "difference",
            "name": "difference"
          },
          {
            "type": "list_type",
            "proto": "dual_parser",
            "generator": "dual_parser_generator",
            "parser": "list",
            "name": "list"
          }
        ]
      },
      {
        "ref": "catPredicate",
        "proto": "single_parser",
        "generator": "single_parser_generator",
        "blocks": [
          {
            "type": "not_type",
            "generator": "single_parser_generator",
            "parser": "not",
            "name": "not"
          },
          {
            "type": "and_type",
            "generator": "single_parser_generator",
            "parser": "and",
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
            "type": "preskipper_all_type",
            "proto": "preskipper_all",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "preskipper_all"
          },
          {
            "type": "preskipper_type",
            "proto": "preskipper",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "preskipper"
          },
          {
            "type": "skipper_type",
            "proto": "dual_parser",
            "generator": "undone_generator",
            "parser": "skip",
            "name": "skipper"
          },
          {
            "type": "skip_type",
            "proto": "single_parser",
            "generator": "dual_parser_generator",
            "parser": "skip",
            "name": "skip"
          },
          {
            "type": "no_skip_type",
            "proto": "no_skip",
            "shadow": "preSkipperShadow",
            "generator": "single_parser_generator",
            "parser": "no_skip",
            "name": "no_skip"
          }
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
            "generator": "string_generator",
            "parser": "string",
            "name": "string"
          },
          {
            "type": "lit_type",
            "proto": "string",
            "generator": "string_generator",
            "parser": "lit",
            "name": "lit"
          },
          {
            "type": "symbols_type",
            "generator": "undone_generator",
            "parser": "symbols",
            "name": "symbols"
          }
        ]
      },
      {
        "ref": "catChar",
        "proto": "char_class_input",
        "blocks": [
          {
            "type": "eol_type",
            "proto": "no_args",
            "generator": "parser_select_generator",
            "parser": "eol",
            "name": "eol"
          },
          {
            "type": "eoi_type",
            "proto": "no_args",
            "generator": "parser_select_generator",
            "parser": "eoi",
            "name": "eoi"
          },
          {
            "type": "char_negate_false_type",
            "proto": "char_negate",
            "generator": "false_generator",
            "name": "char_negate_false"
          },
          {
            "type": "char_negate_true_type",
            "proto": "char_negate",
            "generator": "true_generator",
            "name": "char_negate_true"
          },
          {
            "type": "char_type",
            "proto": "char",
            "shadow": "negateShadow",
            "generator": "char_generator",
            "parser": "char",
            "name": "char"
          },
          {
            "type": "char_all_type",
            "proto": "char_all",
            "generator": "char_all_generator",
            "parser": "char",
            "name": "char_all"
          },
          {
            "type": "char_input_type",
            "proto": "char_input",
            "generator": "char_set_input_generator",
            "parser": "char",
            "name": "char_input"
          },
          {
            "type": "char_range_input_type",
            "proto": "char_range_input",
            "generator": "char_range_input_generator",
            "parser": "char_range",
            "name": "char_range_input"
          },
          {
            "type": "char_set_input_type",
            "proto": "char_set_input",
            "generator": "char_set_input_generator",
            "parser": "char_set",
            "name": "char_set_input"
          },
          {
            "type": "digit_type",
            "generator": "char_class_input_generator",
            "parser": "digit",
            "name": "digit"
          },
          {
            "type": "xdigit_type",
            "generator": "char_class_input_generator",
            "parser": "xdigit",
            "name": "xdigit"
          },
          {
            "type": "alpha_type",
            "generator": "char_class_input_generator",
            "parser": "alpha",
            "name": "alpha"
          },
          {
            "type": "alnum_type",
            "generator": "char_class_input_generator",
            "parser": "alnum",
            "name": "alnum"
          },
          {
            "type": "lower_type",
            "generator": "char_class_input_generator",
            "parser": "lower",
            "name": "lower"
          },
          {
            "type": "graph_type",
            "generator": "char_class_input_generator",
            "parser": "graph",
            "name": "graph"
          },
          {
            "type": "upper_type",
            "generator": "char_class_input_generator",
            "parser": "upper",
            "name": "upper"
          },
          {
            "type": "punct_type",
            "generator": "char_class_input_generator",
            "parser": "punct",
            "name": "punct"
          },
          {
            "type": "print_type",
            "generator": "char_class_input_generator",
            "parser": "print",
            "name": "print"
          },
          {
            "type": "cntrl_type",
            "generator": "char_class_input_generator",
            "parser": "cntrl",
            "name": "cntrl"
          },
          {
            "type": "space_type",
            "generator": "char_class_input_generator",
            "parser": "space",
            "name": "space"
          },
          {
            "type": "blank_type",
            "generator": "char_class_input_generator",
            "parser": "blank",
            "name": "blank"
          }
        ]
      },
      {},
      {
        "ref": "catBoolean",
        "blocks": [
          {
            "type": "all_null_type",
            "proto": "all_null",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "all_null"
          },
          {
            "type": "bool_type",
            "proto": "undone",
            "generator": "undone_generator",
            "parser": "bool",
            "name": "bool"
          },
          {
            "type": "true_type",
            "generator": "parser_select_generator",
            "proto":"no_args",
            "parser": "true",
            "name": "true"
          },
          {
            "type": "false_type",
            "generator": "parser_select_generator",
            "proto":"no_args",
            "parser": "false",
            "name": "false"
          }
        ]
      },
      {
        "ref": "catInteger",
        "proto": "integer_select",
        "blocks": [
          {
            "type": "integer_type",
            "proto": "integer_accept_all",
            "shadow": "integerShadow",
            "generator": "integer_generator",
            "name": "integer"
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
            "parser": "char",
            "name": "integer_input"
          },
          {
            "type": "integer_range_input_type",
            "proto": "integer_range_input",
            "generator": "integer_range_input_generator",
            "parser": "char",
            "name": "integer_range_input"
          },
          {
            "type": "integer_digits_input_type",
            "proto": "integer_digits_input",
            "generator": "integer_digits_input_generator",
            "parser": "char",
            "name": "integer_digits_input"
          },
          {
            "type": "dec_select_type",
            "colour": "200",
            "generator": "parser_select_generator",
            "parser": "int",
            "name": "dec_select"
          },
          {
            "type": "bin_select_type",
            "generator": "parser_select_generator",
            "parser": "bin",
            "name": "bin_select"
          },
          {
            "type": "oct_select_type",
            "generator": "parser_select_generator",
            "parser": "oct",
            "name": "oct_select"
          },
          {
            "type": "hex_select_type",
            "generator": "parser_select_generator",
            "parser": "hex",
            "name": "hex_select"
          },
          {
            "type": "ushort_select_type",
            "generator": "parser_select_generator",
            "parser": "ushort",
            "name": "ushort_select"
          },
          {
            "type": "uint_select_type",
            "generator": "parser_select_generator",
            "parser": "uint",
            "name": "uint_select"
          },
          {
            "type": "ulong_select_type",
            "generator": "parser_select_generator",
            "parser": "ulong",
            "name": "ulong_select"
          },
          {
            "type": "ulonglong_select_type",
            "generator": "parser_select_generator",
            "parser": "ulonglong",
            "name": "ulonglong_select"
          },
          {
            "type": "short_select_type",
            "generator": "parser_select_generator",
            "parser": "short",
            "name": "short_select"
          },
          {
            "type": "int_select_type",
            "generator": "parser_select_generator",
            "parser": "int",
            "name": "int_select"
          },
          {
            "type": "long_select_type",
            "generator": "parser_select_generator",
            "parser": "long",
            "name": "long_select"
          },
          {
            "type": "longlong_select_type",
            "generator": "parser_select_generator",
            "parser": "longlong",
            "name": "longlong_select"
          }
        ]
      },
      {
        "ref": "catFloat",
        "shadow": "floatShadow",
        "proto": "float_accept_all",
        "blocks": [
          {
            "type": "float_all_type",
            "proto": "float_all",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "float_all"
          },
          {
            "type": "float_input_type",
            "proto": "float_input",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "float_input"
          },
          {
            "type": "float_type",
            "generator": "undone_generator",
            "parser": "float",
            "name": "float"
          },
          {
            "type": "double_type",
            "generator": "undone_generator",
            "parser": "double",
            "name": "double"
          },
          {
            "type": "long_double_type",
            "generator": "undone_generator",
            "parser": "long_double",
            "name": "long_double"
          }
        ]
      },
      {},
      {
        "ref": "catBinary",
        "shadow": "binaryShadow",
        "proto": "binary",
        "blocks": [
          {
            "type": "binary_all_type",
            "proto": "binary_all",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "binary_all"
          },
          {
            "type": "binary_input_type",
            "proto": "binary_input",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "binary_input"
          },
          {
            "type": "byte_type",
            "proto": "binary_accept_all",
            "shadow": "byteShadow",
            "generator": "undone_generator",
            "parser": "byte",
            "name": "byte"
          },
          {
            "type": "word_type",
            "generator": "undone_generator",
            "parser": "word",
            "name": "word"
          },
          {
            "type": "dword_type",
            "generator": "undone_generator",
            "parser": "dword",
            "name": "dword"
          },
          {
            "type": "qword_type",
            "generator": "undone_generator",
            "parser": "qword",
            "name": "qword"
          },
          {
            "type": "bin_float_type",
            "generator": "undone_generator",
            "parser": "bin_float",
            "name": "bin_float"
          },
          {
            "type": "bin_double_type",
            "generator": "undone_generator",
            "parser": "bin_double",
            "name": "bin_double"
          },
          {
            "type": "little_endian_type",
            "proto": "endianness",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "little_endian"
          },
          {
            "type": "big_endian_type",
            "proto": "endianness",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "big_endian"
          },
          {
            "type": "native_endian_type",
            "proto": "endianness",
            "shadow": "none",
            "generator": "undone_generator",
            "name": "native_endian"
          }
        ]
      },
      {},
      {
        "ref": "catAuxiliary",
        "blocks": [
          {
            "type": "eps_type",
            "proto": "no_args",
            "generator": "parser_select_generator",
            "parser": "eps",
            "name": "eps"
          },
          {
            "type": "attr_type",
            "proto": "accept_all",
            "generator": "undone_generator",
            "parser": "attr",
            "name": "attr"
          },
          {
            "type": "lazy_type",
            "proto": "single_parser",
            "generator": "single_parser_generator",
            "parser": "lazy",
            "name": "lazy"
          },
          {
            "type": "advance_type",
            "proto": "integer_field",
            "generator": "advance_generator",
            "parser": "advance",
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
                parser: block['parser'] ? block['parser'] : cat['parser'] ? cat['parser'] : '',
                generator: block['generator'] ? block['generator'] : cat['generator'] ? cat['generator'] : 'undone_generator',
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

