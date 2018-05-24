
var Generator = {};

Generator.generators = {
        php: {
            'undone':function(block) {
                return [ '[--> code generator for '+ block.type + ' not implemented yet.]\n', Blockly.PHP.ORDER_NONE ];
            },

            'no_argument': function(block) {
                return '["' + this.data + '", []],\n';
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
                var statements1 = Blockly.PHP.statementToCode(block, 'PARAM1');
                var statements2 = Blockly.PHP.statementToCode(block, 'PARAM2');
                return '["' + block.data + '", [\n' + statements1 + statements2 + ']],';
            },

            'array_parser': function(block) {
                // @todo: sequencer einbauen
                var statements1 = Blockly.PHP.statementToCode(block, 'PARAM1');
                return '["'+ block.data + '", [\n' + statements1 + ']],';
            },

            'integer_all': function(block) {
                return [ "null", Blockly.PHP.ORDER_NONE ];
            },

            'integer_digits_input': function(block) {
                var field1 = block.getFieldValue('PARAM1');
                var field2 = block.getFieldValue('PARAM2');
                var code = 'null, ' + field1 + ', ' + field2;
                return [ code, Blockly.PHP.ORDER_NONE ];
            },

            'integer_range_input': function(block) {
                var field1 = block.getFieldValue('PARAM1');
                var field2 = block.getFieldValue('PARAM2');
                var code = 'null, 1, 0, ' + field1 + ', ' + field2;
                return [ code, Blockly.PHP.ORDER_NONE ];
            },

            'binary': function(block) {
                var endianness = block.getFieldValue('PARAM1');
                var value = Blockly.PHP.valueToCode(block, 'PARAM2', Blockly.PHP.ORDER_NONE);
                var code = '["' + endianness + block.data + '", [' + value + ']],\n';
                return code;
            },

            'byte': function(block) {
                var value = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                var code = '["' + block.data + '", [' + value + ']],\n';
                return code;
            },

            'advance': function(block) {
                var field_value = block.getFieldValue('PARAM1');
                return '["' + block.data + '", [' + field_value + ']],\n';
            },

            'integer_input': function(block) {
                var field_value = block.getFieldValue('PARAM1');
                return [ field_value, Blockly.PHP.ORDER_NONE ];
            },

            'repeat': function(block) {
                var mode = block.getFieldValue('PARAM1');
                var value = block.getFieldValue('PARAM2');
                var min, max;
                switch (mode) {
                case 'exactly':
                     min = max = value;
                     break;
                case 'min':
                    min = value;
                    max = -1;
                    break;
                case 'max':
                    max = value;
                    min = 0;
                    break;
                }
                var subject = Blockly.PHP.statementToCode(block, 'PARAM3');
                return '["'+ block.data + '", [\n' + subject + Blockly.PHP.INDENT + min + ', ' + max + '\n]],\n';
            },

            'repeat_min_max': function(block) {
                var min = block.getFieldValue('PARAM1');
                var max = block.getFieldValue('PARAM2');
                var subject = Blockly.PHP.statementToCode(block, 'PARAM3');
                return '["'+ block.data + '", [\n' + subject + Blockly.PHP.INDENT + min + ', ' + max + '\n]],\n';
            },

            'integer': function (block) {
                var params = Blockly.PHP.valueToCode(block, 'PARAM1', Blockly.PHP.ORDER_NONE);
                return '["' + block.data + '", [' + params + ']],\n';
            },

        },
}

