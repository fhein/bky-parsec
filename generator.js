
var Generator = {};

Generator.generators = {
        'undone_generator':function(block) {
            return [ '[--> code generator for '+ block.type + ' not implemented yet.]\n', Blockly.PHP.ORDER_NONE ];
        },

        'char_generator': function (block) {
            var negate_param = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
            var parser = Blockly.PHP.valueToCode(block, 'PARAM2', Blockly.PHP.ORDER_NONE);
            return parser + negate_param + ']],\n';
        },

        'char_class_input_generator': function(block) {
            var code = '["' + block.parser + '", [';
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'char_range_input_generator': function(block) {
            var field_from = block.getFieldValue('PARAM1');
            var field_to = block.getFieldValue('PARAM2');
            var code = '["' + block.parser + '", ["' + field_from + '", "' + field_to + '", ';
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'char_set_input_generator': function(block) {
            var field_char_set = block.getFieldValue('PARAM1');
            var code = '["' + block.parser + '", ["' + field_char_set + '", ';
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'char_all_generator': function(block) {
            var code = '["' + block.parser + '", [null, ';
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'single_parser_generator': function(block) {
            // @todo: sequencer einbauen
            var statements_param = Blockly.PHP.statementToCode(block, 'PARAM1');
            return '["'+ block.parser + '", [\n' + statements_param + ']],';
        },

        'dual_parser_generator': function(block) {
            // @todo: sequencer einbauen
            var statements_param1 = Blockly.PHP.statementToCode(block, 'PARAM1');
            var statements_param2 = Blockly.PHP.statementToCode(block, 'PARAM2');
            return '["' + block.parser + '", [\n' + statements_param1 + statements_param2 + ']],';
        },

        'integer_all_generator': function(block) {
            return [ "null", Blockly.PHP.ORDER_NONE ];
        },

        'integer_digits_input_generator': function(block) {
            var field_from = block.getFieldValue('PARAM1');
            var field_to = block.getFieldValue('PARAM2');
            var code = 'null, ' + field_from + ', ' + field_to;
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'integer_range_input_generator': function(block) {
            var field_from = block.getFieldValue('PARAM1');
            var field_to = block.getFieldValue('PARAM2');
            var code = 'null, 1, 0, ' + field_from + ', ' + field_to;
            return [ code, Blockly.PHP.ORDER_NONE ];
        },

        'string_generator': function(block) {
            var field_string = block.getFieldValue('PARAM1');
            return '["'+ block.parser + '", ["' + field_string + '"]],';
        },

        'integer_input_generator': function(block) {
            var field_value = block.getFieldValue('PARAM1');
            return [ field_value, Blockly.PHP.ORDER_NONE ];
        },

        'advance_generator': function(block) {
            var field_value = block.getFieldValue('PARAM1');
            return '["' + block.parser + '", [' + field_value + ']],\n';
        },

        'integer_generator': function (block) {
            var parser = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
            var params = Blockly.PHP.valueToCode(block, 'PARAM2', Blockly.PHP.ORDER_NONE);
            return '["' + parser + '", [' + params + ']],\n';
        },

        'true_generator': function(block) {
            return [ 'true', Blockly.PHP.ORDER_NONE ];
        },
        'false_generator': function(block) {
            return [ 'false', Blockly.PHP.ORDER_NONE ];
        },

        'parser_select_generator': function(block) {
            return '["' + this.parser + '", []],\n';
        },
}

Generator.registerGenerators = function() {
//    var args_parserarray_generator = function(block) {
//        var parser = generators[block.type]["name"];
//        var statements_param = Blockly.PHP.statementToCode(block, 'PARAM');
//        return '["'+parser+'", [[' + statements_param + ']]], ';
//    };
//
//    var args_string_generator = function(block) {
//        var parser = generators[block.type]["name"];
//        var field_param = block.getFieldValue("PARAM");
//        return '["' + parser + '", ["' + field_param + '"]], ';
//    };
//
//    var args_integer_generator = function(block) {
//        var parser = generators[block.type]["name"];
//        var value_param = Blockly.PHP.valueToCode(block, "PARAM", Blockly.PHP.ORDER_NONE);
//        return '["' + parser + '", [' + value_param + ']], ';
//    };
//
//    var args_char_class_generator = function(block) {
//        var parser = generators[block.type]["name"];
//        var field_negate = block.getFieldValue("NEGATE");
//        return '["' + parser + '", [' + field_negate.toLowerCase() + ']], ';
//    }
//
//    var args_float_generator = args_integer_generator;
//    var args_binary_generator = args_integer_generator;
//
//    var undone_generator = function(block) {
//        var parser = generators[block.type]["name"];
//        return "[*** " + parser + " (undone) ***]";
//    };


    for (var parser in Generator.generators) {
        Blockly.PHP[parser] = Generator.generators[parser];
    }

//    Blockly.PHP['all_null_type'] = function(block) {
//        return ["null", Blockly.PHP.ORDER_NONE];
//    };
//
//    Blockly.PHP['rule'] = function(block) {
//        var variable_rulename = Blockly.PHP.variableDB_.getName(block
//                .getFieldValue('ruleName'), Blockly.Variables.NAME_TYPE);
//        var statements_ruleparser = Blockly.PHP.statementToCode(block,
//                'ruleParser');
//        // TODO: Assemble PHP into code variable.
//        var code = '...;\n';
//        return code;
//    };
//
//    Blockly.PHP['grammar'] = function(block) {
//        var variable_name = Blockly.PHP.variableDB_.getName(block
//                .getFieldValue('name'), Blockly.Variables.NAME_TYPE);
//        var variable_startrulename = Blockly.PHP.variableDB_.getName(block
//                .getFieldValue('startRuleName'), Blockly.Variables.NAME_TYPE);
//        var statements_grammarparser = Blockly.PHP.statementToCode(block,
//                'grammarParser');
//        // TODO: Assemble PHP into code variable.
//        var code = '...;\n';
//        return code;
//    };
//
//    Blockly.PHP['rulereference'] = function(block) {
//        var variable_rulename = Blockly.PHP.variableDB_.getName(block
//                .getFieldValue('ruleName'), Blockly.Variables.NAME_TYPE);
//        // TODO: Assemble PHP into code variable.
//        var code = '...;\n';
//        return code;
//    };

}
