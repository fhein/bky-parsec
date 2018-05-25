var Extensions = {};

Extensions.pgAssoc = {};

Extensions.addChangeHandler = function(block, handler) {
  if (!block.changeStack) {
    block.changeStack = [];
    block.addChangeHandler = function(handler) {
      block.changeStack.push(handler);
    }
    block.setOnChange(function(changeEvent) {
      for (var handler of block.changeStack) {
        handler(changeEvent);
      }
    });
  }
  block.addChangeHandler(handler);
}

Extensions.extensions = {

  'register_generator': function() {
    var obj = Extensions.pgAssoc[this.type];
    this.data = obj.data;
    this.generator = obj.generator;
    Blockly.PHP[this.type] = Generator.generators.php[this.generator];
  },

  'use_parent_tooltip': function() {
    var that = this;
    this.setTooltip(function() {
      var parent = that.getParent();
      var myTooltip = that.type.substr(0, that.type.length - 5).toUpperCase() + '_TOOLTIP';
      return (parent && parent.getInputsInline() && parent.tooltip) ||
        Blockly.Msg[myTooltip];
    });
  },

  'onchange_warning_example': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      if (that.getInput('PARAM1').connection.targetBlock()) {
        that.setWarningText(null);
      } else {
        that.setWarningText('Must have an input block.');
      }
    });
  },

  'onchange_log_event': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      console.log(changeEvent.toJson());
    });
  },

  // this extension depends on onchange-stack
  'onchange_set_parent_colour': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      var parent = that.getParent();
      if (parent) {
        parent.setColour(that.getColour());
      }
    });
  },

  // this extension depends on onchange-stack
  'onchange_get_parent_colour': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      var parent = that.getParent();
      if (parent) {
        that.setColour(parent.getColour());
      }
    })
  },

  'onchange_restore_default_colour': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      if (!that.getInput('PARAM1').connection.targetBlock()) {
        var myColour = that.type.substr(0, that.type.length - 5).toUpperCase() + '_HUE';
        that.setColour(Blockly.Msg[myColour]);
      }
    })
  },
};

Extensions.init = function(extensionList) {
  for (extension of extensionList) {
    if (typeof this.extensions[extension] !== 'function') {
      console.log('Extension ' + extension + ' not implemented yet. Stub inserted.');
      var that = {};
      that.extension = extension;
      var code = function() {
        console.log('Stub for extension ' + that.extension + ' which is not implemented yet.');
      };
    } else {
      var code = this.extensions[extension];
    }
    Blockly.Extensions.register(extension, code);
  }
};

Extensions.addParserGeneratorAssoc = function(bType, assoc) {
  this.pgAssoc[bType] = assoc;
}