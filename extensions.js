var Extensions = (function (Extensions, player, config, app, undefined) {

  var nonTerminalIds = new Map;

  var nonTerminalTypes = [
    'rule_type', 'grammar_type'
  ];

  var isNonTerminal = function(type) {
    return nonTerminalTypes.indexOf(type) >= 0;
  }


  var addChangeHandler = function (block, handler) {
    if (!block.changeStack) {
      block.changeStack = [];
      block.addChangeHandler = function (handler) {
        block.changeStack.push(handler);
      }
      block.setOnChange(function (changeEvent) {
        for (var handler of block.changeStack) {
          handler(changeEvent);
        }
      });
    }
    block.addChangeHandler(handler);
  };

  var setupCustomContextMenu = function (block) {
    if (!block.customContextMenuOptions) {
      block.customContextMenuOptions = [];
    };
    if (!block.customContextMenu) {
      block.customContextMenu = function (menuOptions) {
        for (var option of block.customContextMenuOptions) {
          menuOptions.unshift(option);
        }
      }
    }
  }

  // corrects nonTerminalIds map if a nonterminal block is deleted
  Extensions.onDeleteNonterminalOrReference = function (event) {
    if (event.type == Blockly.Events.DELETE) {
      var parser = new DOMParser();
      var blockXML = event.oldXml.outerHTML;
      var doc = parser.parseFromString(blockXML, "text/html");
      var blockHtml = doc.getElementsByTagName("block");

      for (html of blockHtml) {
        var type = html.getAttribute('type');
        var id = html.getAttribute('id');

        if (type == 'reference_type') {
          let x = html.children[1];
          if (!x) continue;
          x = x.innerHTML;
          if (!x) continue;
          x = app.workspace.getBlockById(x);
          if (x) x.removeReference(id);
          continue;
        } 
        // It does not hurt if id is of a nonterminal block here.
        // There is no map entry then and delete will return false.
        nonTerminalIds.delete(id);
      }
    }
  }

  var extensions = {
    'register_test_run_option': function () {
      var that = this;
      setupCustomContextMenu(that);
      that.customContextMenuOptions.unshift(
        {
          enabled: true,
          text: 'Test Parser',
          callback: function () {
            player.playPause(that);
          }
        });
      that.customContextMenuOptions.unshift(
        {
          enabled: true,
          text: 'Run Parser',
          callback: function () {
            player.run(that);
          }

        });
    },
    'register_togglebreakpoint_option': function () {
      var that = this;
      setupCustomContextMenu(that);
      that.customContextMenuOptions.unshift(
        {
          enabled: true,
          text: 'Toggle Breakpoint',
          callback: function () {
            player.toggleBreakpoint(that);
          }
        });
    },
    // This extension adds a 'Create reference' menu item to the blocks context menu.
    // applicable on nonterminal blocks only
    'register_refcreate_option': function () {
      var that = this;
      setupCustomContextMenu(that);
      that.customContextMenuOptions.unshift(
        {
          enabled: true,
          text: 'Create Reference',
          callback: function () {
            var block = app.workspace.newBlock('reference_type');
            name = that.getFieldValue('PARAM1');
            let id = ([...nonTerminalIds].find(([, v]) => v === name) || [])[0];
            block.setFieldValue(id, 'PARAM1');
            var posXY = that.getRelativeToSurfaceXY();
            block.moveBy(posXY.x + 100, posXY.y);
            // @todo: Cascade by small offsets if there are already references at that position
            block.initSvg();
            block.render();
          }
        });
    },

    // This extension adds reference handling to blocks
    // applicable on nonterminal blocks only
    'nonterminal_references': function() {
      var that = this;

      that.references = [];

      that.removeReference = function (id) {
        let pos = that.references.indexOf(id);
        if (pos != -1) that.references.splice(pos,1);
        that.setDeletable(that.references.length == 0);
      };
      
      that.addReference = function (id) {
        that.setDeletable(false);
        that.references.push(id);
      };

      that.renderReferences = function(value) {
        for (var reference of that.references) {
          reference = app.workspace.getBlockById(reference);
          let dropdown = reference.getField('PARAM1');
          dropdown.setText(that.getFieldValue('PARAM1'));
          reference.render();
         }
      }
    },
    'register_generator': function () {
      var obj = parserGeneratorLink[this.type];
      this.data = obj.data;
      this.generator = obj.generator;
      Blockly.PHP[this.type] = Generator.generators.php[this.generator];
    },

    // for debugging purposes
    // applicable on all blocks
    'onchange_log_event': function () {
      addChangeHandler(this, function (changeEvent) {
        console.log(changeEvent.toJson());
      });
    },

    // this extension generates the dropdown entries for the reference block
    // applicable only on reference_type blocks
    'reference_dropdown': function () {
      
      var dropdown = new Blockly.FieldDropdown(function () {
        if (nonTerminalIds.size == 0) {
          return ['dummy', 'dummy'];
        }
        var options = [];
        for (var option of nonTerminalIds) {
          if (option) options.push([option[1], option[0]]);
        }
        return options;
      });
      this.inputList[0].appendField(dropdown, 'PARAM1');
    },
    
    // This extension makes sure that referenced grammars/rules can't be deleted
    // applicable only on reference_type blocks
    'adjust_referenced_nonterminal_delete_mode': function () {
      let that = this;
      addChangeHandler(this, function (event) {
        if (that.id != event.blockId || that.isInFlyout || !(event.type == Blockly.Events.CREATE || event.type == Blockly.Events.CHANGE)) return;
        var id = that.getFieldValue('PARAM1');
        switch (event.type) {
          case Blockly.Events.CREATE:
            var nonTerminal = app.workspace.getBlockById(id);
            if (nonTerminal) {
              nonTerminal.addReference(that.id);
              // next two lines provide a workaround for the dropdown displaying wrongly
              // the field value (a block id) instead of the nonterminal name
              // on page reload            
              that.getField('PARAM1').setText(nonTerminal.getFieldValue('PARAM1'));
              that.setFieldValue(id, 'PARAM1');
            }
            break;
          case Blockly.Events.CHANGE:
            var rule = app.workspace.getBlockById(event.oldValue);
            if (rule) rule.removeReference(that.id);
            rule = app.workspace.getBlockById(event.newValue);
            if (rule) rule.addReference(that.id);
            break;
        }
      });
    },
    // this extension handles name changes for rule and grammar blocks
    // applicable only on nonterminal blocks (rule, grammar)
    'onchange_nonterminal_name': function () {
      var that = this;
      addChangeHandler(this, function (event) {

        if (that.id != event.blockId) return;
        let name = that.getFieldValue('PARAM1');
        let id = ([...nonTerminalIds].find(([, v]) => v === name) || [])[0];

        switch (event.type) {
          case Blockly.Events.CREATE:
            if (!id) {
              if (!that.isInFlyout) {
                nonTerminalIds.set(that.id, name);
                that.renderReferences();
              }
            } else { 
              while (id && nonTerminalIds.has(id)) {
                // extract trailing number
                var num = name.replace(/^\D+/g, '');
                var basename = name.substr(0, name.length - num.length);
                if (num.length == 0) num = '0';
                name = basename + (parseInt(num) + 1);
                id = ([...nonTerminalIds].find(([, v]) => v === name) || [])[0];
              }
              that.setFieldValue(name, 'PARAM1');
              if (!that.isInFlyout) nonTerminalIds.set(that.id, that.name);
            }
            break;

          case Blockly.Events.CHANGE:
            if (that.isInFlyout) break;
            nonTerminalIds.set(that.id, event.newValue);
            that.renderReferences(event.newValue);
            break;
          //deletion is handled in workspace event listener
        }
      });
    },

    //-------------------------------------------------------------------------
    // usage examples not currently used in this project

    // this extension generates the dropdown entries for the reference block

    'use_parent_tooltip': function () {
      var that = this;
      this.setTooltip(function () {
        var parent = that.getParent();
        var myTooltip = that.type.substr(0, that.type.length - 5).toUpperCase() + '_TOOLTIP';
        return (parent && parent.getInputsInline() && parent.tooltip) ||
          Blockly.Msg[myTooltip];
      });
    },

    'onchange_warning_example': function () {
      addChangeHandler(this, function (changeEvent) {
        if (that.getInput('PARAM1').connection.targetBlock()) {
          that.setWarningText(null);
        } else {
          that.setWarningText('Must have an input block.');
        }
      });
    },

    // this extension depends on onchange-stack
    'onchange_set_parent_colour': function () {
      addChangeHandler(this, function (changeEvent) {
        var parent = that.getParent();
        if (parent) {
          parent.setColour(that.getColour());
        }
      });
    },

    // this extension depends on onchange-stack
    'onchange_get_parent_colour': function () {
      addChangeHandler(this, function (changeEvent) {
        var parent = that.getParent();
        if (parent) {
          that.setColour(parent.getColour());
        }
      })
    },

    'onchange_restore_default_colour': function () {
      addChangeHandler(this, function (changeEvent) {
        if (!that.getInput('PARAM1').connection.targetBlock()) {
          var myColour = that.type.substr(0, that.type.length - 5).toUpperCase() + '_HUE';
          that.setColour(Blockly.Msg[myColour]);
        }
      })
    },
  };

  var addChangeHandler = function (block, handler) {
    if (!block.changeStack) {
      block.changeStack = [];
      block.addChangeHandler = function (handler) {
        block.changeStack.push(handler);
      }
      block.setOnChange(function (changeEvent) {
        for (var handler of block.changeStack) {
          handler(changeEvent);
        }
      });
    }
    block.addChangeHandler(handler);
  };

  var parserGeneratorLink = {};

  Extensions.init = function (extensionList) {
    for (extension of extensionList) {
      if (typeof extensions[extension] !== 'function') {
        console.log('Extension ' + extension + ' not implemented yet. Stub inserted.');
        var that = {};
        that.extension = extension;
        var code = function () {
          console.log('Stub for extension ' + that.extension + ' which is not implemented yet.');
        };
      } else {
        var code = extensions[extension];
      }
      Blockly.Extensions.register(extension, code);
    }
  };

  Extensions.linkParserToGenerator = function (bType, assoc) {
    parserGeneratorLink[bType] = assoc;
  };

  return Extensions;

})(Extensions || {}, Player, Config, mxcParsec);

console.log('Public interface of Extensions:', Extensions);