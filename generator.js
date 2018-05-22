
var Generator = {};

Generator.generators = {
        php: {
            'undone_generator':function(block) {
                return [ '[--> code generator for '+ block.type + ' not implemented yet.]\n', Blockly.PHP.ORDER_NONE ];
            },

            'single_text_field': function(block) {
                var value = block.getFieldValue('PARAM1');
                var code = '["' + block.data + '", ["' + value + '"]],\n';
                return code;
            },

            'dual_text_field': function(block) {
                var value1 = block.getFieldValue('PARAM1');
                var value2 = block.getFieldValue('PARAM2');

                return '["' + block.data + '", ["' + value1 + '", "' + value2 +   '"]],\n';
            },

            'single_parser': function(block) {
                // @todo: sequencer einbauen
                var statements_param = Blockly.PHP.statementToCode(block, 'PARAM1');
                return '["'+ block.data + '", [\n' + statements_param + ']],';
            },

            'dual_parser': function(block) {
                // @todo: sequencer einbauen
                var statements_param1 = Blockly.PHP.statementToCode(block, 'PARAM1');
                var statements_param2 = Blockly.PHP.statementToCode(block, 'PARAM2');
                return '["' + block.data + '", [\n' + statements_param1 + statements_param2 + ']],';
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

            'binary_generator': function(block) {
                var endianness = Blockly.PHP.valueToCode(block, 'PARAM2', Blockly.PHP.ORDER_NONE);
                var value = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                var code = '["' + endianness + block.data + '", [' + value + ']],\n';
                return code;
            },

            'byte_generator': function(block) {
                var value = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                var code = '["' + block.data + '", [' + value + ']],\n';
                return code;
            },

            'integer_input_generator': function(block) {
                var field_value = block.getFieldValue('PARAM1');
                return [ field_value, Blockly.PHP.ORDER_NONE ];
            },

            'repeat_generator': function(block) {
                var params = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                var subject = Blockly.PHP.statementToCode(block, 'PARAM2');
                return '["'+ block.data + '", [\n' + subject + Blockly.PHP.INDENT + params + '\n]],\n';
            },

            'repeat_min_max_generator': function(block) {
                var field_min = block.getFieldValue('PARAM1');
                var field_max = block.getFieldValue('PARAM2');
                var code = field_min + ', ' + field_max;
                return [ code, Blockly.PHP.ORDER_NONE ];
            },

            'repeat_min_generator': function(block) {
                var field_min = block.getFieldValue('PARAM1');
                return [ field_min, Blockly.PHP.ORDER_NONE ];
            },

            'repeat_exactly_generator': function(block) {
                var field = block.getFieldValue('PARAM1');
                var code = field + ', ' + field;
                return [ code, Blockly.PHP.ORDER_NONE ];
            },

            'repeat_forever_generator': function(block) {
                return [ '', Blockly.PHP.ORDER_NONE ];
            },

            'advance_generator': function(block) {
                var field_value = block.getFieldValue('PARAM1');
                return '["' + block.data + '", [' + field_value + ']],\n';
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

            'no_skip_generator': function(block) {
                // @todo: sequencer einbauen
                var parser = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                var subject = Blockly.PHP.statementToCode(block, 'PARAM2');
                return '["'+ parser + '", [\n' + subject + ']],';
            },

            'no_argument': function(block) {
                return '["' + this.data + '", []],\n';
            },

            'parser_select_generator': function(block) {
                return [ this.data, Blockly.PHP.ORDER_NONE];
            },
        },
}

