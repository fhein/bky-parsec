var Generator = {};

Generator.createSingleParser = function(block, param) {
  var statements = Blockly.PHP.statementToCode(block, param);
  var child = block.getInputTargetBlock(param);
  var hasSequence = (child && child.getNextBlock() != null);
  return hasSequence ? '["sequence",["auto_sequence",['+statements+']]],' : statements;
}

Generator.generators = {
  php: {
    'undone': function(block) {
      return [
        '[--> code generator for ' + block.type + ' not implemented yet.]',
        Blockly.PHP.ORDER_NONE
      ];
    },

    'undone_statement': function(block) {
      return '[--> code generator for ' + block.type +
        ' not implemented yet.],';
    },

    'no_argument': function(block) {
      return '["' + this.data + '", ["' + block.id + '"]],';
    },

    'space': function(block) {
      return '["' + block.data + '", ["' + block.id + '", "space"]],';
    },

    'single_text_field': function(block) {
      var value = block.getFieldValue('PARAM1');
      var code = '["' + block.data + '", ["' + block.id + '", "' + value + '"]],';
      return code;
    },

    'dual_text_field': function(block) {
      var value1 = block.getFieldValue('PARAM1');
      var value2 = block.getFieldValue('PARAM2');

      return '["' + block.data + '", ["' + block.id + '", "'+ value1 + '", "' + value2 + '"]],';
    },

    'single_parser': function(block) {
      return '["' + block.data + '", ["' + block.id + '", '+ Generator.createSingleParser(block, 'PARAM1') + ']],';
    },

    'dual_parser': function(block) {
      return '["' + block.data + '", ["' + block.id + '", '+ Generator.createSingleParser(block, 'PARAM1') + Generator.createSingleParser(block, 'PARAM2') + ']],';
    },

    'array_parser': function(block) {
      // @todo: assert that there is more than one parser
      var statements1 = Blockly.PHP.statementToCode(block, 'PARAM1');
      return '["' + block.data + '", ["'+ block.id + '", ' + '['  + statements1 + ']]],';
    },

    'integer_all': function(block) {
      return ["null", Blockly.PHP.ORDER_NONE];
    },

    'integer_digits_input': function(block) {
      var field1 = block.getFieldValue('PARAM1');
      var field2 = block.getFieldValue('PARAM2');
      var code = 'null, ' + field1 + ', ' + field2;
      return [code, Blockly.PHP.ORDER_NONE];
    },

    'integer_range_input': function(block) {
      var field1 = block.getFieldValue('PARAM1');
      var field2 = block.getFieldValue('PARAM2');
      var code = 'null, 1, 0, ' + field1 + ', ' + field2;
      return [code, Blockly.PHP.ORDER_NONE];
    },

    'binary': function(block) {
      var endianness = block.getFieldValue('PARAM1');
      var value = Blockly.PHP.valueToCode(block, 'PARAM2',
        Blockly.PHP.ORDER_NONE);
      var code = '["' + endianness + block.data + '", [' + value + ']],';
      return code;
    },

    'byte': function(block) {
      var value = Blockly.PHP.valueToCode(block, 'PARAM1',
        Blockly.PHP.ORDER_NONE);
      var code = '["' + block.data + '", ["' + block.id + '", '+ value + ']],';
      return code;
    },

    'advance': function(block) {
      var field_value = block.getFieldValue('PARAM1');
      return '["' + block.data + '", ["' + block.id + '", ' + field_value + ']],';
    },

    'integer_input': function(block) {
      var field_value = block.getFieldValue('PARAM1');
      return [field_value, Blockly.PHP.ORDER_NONE];
    },
    
    'attr': function(block) {
      var type = block.getFieldValue('PARAM1');
      var value = block.getFieldValue('PARAM2');
      return '["' + block.data + '", ["' + block.id + '", "'+ type + '", "' + value + '"]],';
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
      var code = '["' + block.data + '", [' + subject + min;
      return '["' + block.data + '", ["' + block.id + '", '+ subject + min + ', ' + max + ']],';
    },

    'repeat_min_max': function(block) {
      var min = block.getFieldValue('PARAM1');
      var max = block.getFieldValue('PARAM2');
      var subject = Blockly.PHP.statementToCode(block, 'PARAM3');
      return '["' + block.data + '", ["' + block.id + '", '+ subject + min + ', ' + max + ']],';
    },

    'integer': function(block) {
      var params = Blockly.PHP.valueToCode(block, 'PARAM1',
        Blockly.PHP.ORDER_NONE);
      return '["' + block.data + '", ["' + block.id + '", ' + params + ']],';
    },

    'rule': function(block) {
      var name = block.getFieldValue('PARAM1');
      var attrType = block.getFieldValue('PARAM2');
      attrType = attrType === 'default' ? '' : '"'+attrType+'"';
      return '"'+ name +'":["' + block.data + '", [' + '"' + block.id + '", "' + name +
        '",' + Generator.createSingleParser(block, 'PARAM3') + Generator.createSingleParser(block, 'PARAM4') + attrType + ']],';
    },
    
    'grammar': function(block) {
      var name = block.getFieldValue('PARAM1');
      var subject = Blockly.PHP.statementToCode(block, 'PARAM2');
      var start = block.getFieldValue('PARAM3');
      return '"'+ name + '":["' + block.data + '", [' + '"' + block.id + '", "' + name + '",'
      + '[' + subject + '], ' + '"' + start + '",' + ']],';
    },

    'reference': function(block) {
      var value = block.getFieldValue('PARAM1');
      var rule =  block.workspace.getBlockById(value);
      value = rule.getFieldValue('PARAM1');
      var code = '["' + block.data + '", ["' + block.id + '", "' + value + '"]],';
      return code;
    },
  },
}