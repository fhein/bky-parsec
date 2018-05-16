
var Generator = {};

Generator.registerGenerators = function() {
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
    var single_parser_generator = function(block) {
        // @todo: sequencer einbauen
        var parser = generators[block.type]["parser"];
        var statements_param = Blockly.PHP.statementToCode(block, "PARAM1");
        return '["'+ parser + '", [\n' + statements_param + ']],';
    };

    var dual_parser_generator = function(block) {
        // @todo: sequencer einbauen
        var parser = generators[block.type]["parser"];
        var statements_param1 = Blockly.PHP.statementToCode(block, 'PARAM1');
        var statements_param2 = Blockly.PHP.statementToCode(block, 'PARAM2');
        return '["'+ parser + '", [\n' + statements_param1 + statements_param2
        + ']],';
    };

    var undone_generator = function(block) {
        var parser = generators[block.type];
        return [ "undone "+ parser, Blockly.PHP.ORDER_NONE ];
    }

    var no_args_generator = function(block) {
        var parser = generators[block.type]["parser"];
        return '["'+ parser + '", []],\n';
    };

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
        return parser + negate_param + ']],\n';
    }

    var integer_all_generator = function(block) {
        return [ "null, ", Blockly.PHP.ORDER_NONE ];
    }

    var integer_digits_input_generator = function(block) {
        var field_from = block.getFieldValue("PARAM1");
        var field_to = block.getFieldValue("PARAM2");
        var code = field_from + ', ' + field_to + ', ';
        return [ code, Blockly.PHP.ORDER_NONE ];
    }

    var integer_range_input_generator = integer_digits_input_generator;

    var integer_input_generator = function(block) {
        var field_value = block.getFieldValue("PARAM1");
        return [ field_value, Blockly.PHP.ORDER_NONE ];
    }

    var integer_generator = function (block) {
        var parser = generators[block.type]["parser"];
        var field_input = Blockly.PHP.valueToCode(block, "PARAM1", Blockly.PHP.ORDER_NONE);
        var inputType = block.getChildren()[0].type;
        var filler = '';
        switch (inputType) {
            case "integer_digits_input_type":
                filler = 'null, ';
                break;
            case "integer_range_input_type":
                filler = 'null, 1, 0, ';
                break;
            case"integer_input_type":
                /**/
        }
        return '["' + parser + '", ['+ filler + field_input + ']],\n';
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
        byte_type:{"parser":"byte","codegenerator":undone_generator},
        dword_type:{"parser":"dword","codegenerator":undone_generator},
        qword_type:{"parser":"qword","codegenerator":undone_generator},
        word_type:{"parser":"word","codegenerator":undone_generator},
        bin_double_type:{"parser":"bin_double","codegenerator":undone_generator},
        bin_float_type:{"parser":"bin_float","codegenerator":undone_generator},

        char_type:{"parser":"char","codegenerator":char_generator},
        char_set_input_type:{"parser":"char_set","codegenerator":char_set_input_generator},
        char_range_input_type:{"parser":"char_range","codegenerator":char_range_input_generator},
        char_input_type:{"parser":"char","codegenerator":char_set_input_generator},
        char_all_type:{"parser":"char","codegenerator":char_all_generator},

        as_string_type:{"parser":"as_string","codegenerator":single_parser_generator},
        no_skip_type:{"parser":"no_skip","codegenerator":single_parser_generator},
        no_case_type:{"parser":"no_case","codegenerator":single_parser_generator},
        raw_type:{"parser":"raw","codegenerator":single_parser_generator},
        matches_type:{"parser":"matches","codegenerator":single_parser_generator},
        lexeme_type:{"parser":"lexeme","codegenerator":single_parser_generator},
        hold_type:{"parser":"hold","codegenerator":single_parser_generator},
        expect_type:{"parser":"expect","codegenerator":single_parser_generator},
        omit_type:{"parser":"omit","codegenerator":single_parser_generator},
        plus_type:{"parser":"plus","codegenerator":single_parser_generator},
        kleene_type:{"parser":"kleene","codegenerator":single_parser_generator},
        optional_type:{"parser":"optional","codegenerator":single_parser_generator},
        lazy_type:{"parser":"lazy","codegenerator":single_parser_generator},
        not_type:{"parser":"not","codegenerator":single_parser_generator},
        and_type:{"parser":"and","codegenerator":single_parser_generator},
        difference_type:{"parser":"difference","codegenerator":undone_generator},
        list_type:{"parser":"list","codegenerator":dual_parser_generator},
        permutation_type:{"parser":"permutation","codegenerator":undone_generator},
        alternative_type:{"parser":"alternative","codegenerator":dual_parser_generator},
        sequence_type:{"parser":"sequence","codegenerator":undone_generator},
        sequential_or_type:{"parser":"sequential_or","codegenerator":undone_generator},
        ushort_type:{"parser":"ushort","codegenerator":integer_generator},
        uint_type:{"parser":"uint","codegenerator":integer_generator},
        ulong_type:{"parser":"ulong","codegenerator":integer_generator},
        ulong_long_type:{"parser":"ulong_long","codegenerator":integer_generator},
        short_type:{"parser":"short","codegenerator":integer_generator},
        int_type:{"parser":"int","codegenerator":integer_generator},
        long_type:{"parser":"long","codegenerator":integer_generator},
        long_long_type:{"parser":"long_long","codegenerator":integer_generator},
        integer_all_type:{"parser":"char","codegenerator":integer_all_generator},
        integer_input_type:{"parser":"char","codegenerator":integer_input_generator},
        integer_range_input_type:{"parser":"char","codegenerator":integer_range_input_generator},
        integer_digits_input_type:{"parser":"char","codegenerator":integer_digits_input_generator},
        bin_type:{"parser":"bin","codegenerator":undone_generator},
        hex_type:{"parser":"hex","codegenerator":undone_generator},
        oct_type:{"parser":"oct","codegenerator":undone_generator},
        float_type:{"parser":"float","codegenerator":undone_generator},
        long_double_type:{"parser":"long_double","codegenerator":undone_generator},
        double_type:{"parser":"double","codegenerator":undone_generator},
        advance_type:{"parser":"advance","codegenerator":undone_generator},
        lit_type:{"parser":"lit","signature":"string","codegenerator":undone_generator},
        string_type:{"parser":"string","signature":"string","codegenerator":undone_generator},
        attr_type:{"parser":"attr","codegenerator":undone_generator},
        all_null_type:{"prototype":"all_null","codegenerator":no_args_generator},
        char_negate_true_type:{"prototype":"char_negate","codegenerator":true_generator},
        char_negate_false_type:{"prototype":"char_negate","codegenerator":false_generator},
        little_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        big_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        native_endian_type:{"prototype":"endianness","codegenerator":no_args_generator},
        skip_type:{"parser":"skip","codegenerator":dual_parser_generator},
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

}
