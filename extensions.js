var Extensions = (function(Extensions, mxcParsec, undefined) {

    /**
     * rule or grammar can be delteted if all references have been removed
     */
    var setParserDeletable = function(block) {
        if (block.type == "rule_type" || block.type == "grammar_type") {
          block.referenceCount--;
          if (block.referenceCount == 0) {
            block.setDeletable(true);
          }
          return true;
        }
        return false;
      }
    
    /**
     * rule or grammar cannot be delteted if a reference exists
     */
      var setParserUndeletable = function (block) {
        if (block.type == "rule_type" || block.type == "grammar_type") {
          block.setDeletable(false);
          if (block.referenceCount != undefined) {
            block.referenceCount++;
          } else {
            block.referenceCount = 1;
          }
          return true;
        }
        return false;
      }

  var addChangeHandler = function(block, handler) {
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
  };


  var extensions = {
      'register_generator': function() {
        var obj = parserGeneratorLink[this.type];
        this.data = obj.data;
        this.generator = obj.generator;
        Blockly.PHP[this.type] = Generator.generators.php[this.generator];
      },

      // for debugging purposes
      'onchange_log_event': function() {
        addChangeHandler(this, function(changeEvent) {
          console.log(changeEvent.toJson());
        });
      },

      // this extension generates the dropdown entries for the reference block
      'reference_dropdown': function() {
        var dropdown = new Blockly.FieldDropdown(mxcParsec.dynamicReferenceOptions);
        this.inputList[0].appendField(dropdown, 'PARAM1');

      },
      // this extension makes sure that referenced grammars/rules can't be deleted
      'handleTopBlockDeletions': function() {
        var that = this;
        addChangeHandler(this, function(changeEvent) {
          var blockName = that.getFieldValue('PARAM1');
          var eventType = changeEvent.type; 
          var blockID = that.id;
          var eventID = changeEvent.blockId;

          
          if (blockID == eventID && that.isInFlyout == false) {
            if (eventType == Blockly.Events.CREATE || eventType == Blockly.Events.CHANGE) {

              var allTopBlocks = mxcParsec.workspace.getTopBlocks(false);

              for (var topBlock of allTopBlocks) {
            	  //var result = setParserDeletable(topBlock);
            	  var topBlockName = topBlock.getFieldValue('PARAM1');
            	  if (topBlockName == blockName){
            		  setParserUndeletable(topBlock);
            	  }
            	  if (eventType ==Blockly.Events.CHANGE){
            		  var oldV = changeEvent.oldValue;
            		  if (topBlockName == oldV){
            			  setParserDeletable(topBlock);
            		  }
            	  }
              }
            }
          }
        });
      },
      // this extension handles name changes for rule and grammar blocks
      'onchange_name_handler': function() {
        var that = this;
        addChangeHandler(this, function(changeEvent) {

          var blockName = that.getFieldValue('PARAM1');
          var eventType = changeEvent.type; //Blockly.Events.CREATE
          var blockID = that.id;
          var eventID = changeEvent.blockId;

          if (blockID == eventID) {
             switch (eventType) {

              case Blockly.Events.CREATE:
                //check if blockname already exists
                if (parserNames.length > 0) {
                  if (parserNames.includes(blockName)) {
                    while (parserNames.includes(blockName)) {

                      //compute new blockName
                      var i = 1;
                      var nameEnding = blockName.substring(blockName.length - i);
                      var lastNumber = 1;
                      while (!isNaN(parseInt(nameEnding))) {
                        lastNumber = parseInt(nameEnding);
                        i++;
                        nameEnding = blockName.substring(blockName.length - i);
                      }

                      var newName = blockName.substring(0, blockName.length - (i - 1)) + (lastNumber + 1);
                      blockName = newName;


                    }
                    that.setFieldValue(newName, 'PARAM1');
                    if (!that.isInFlyout) parserNames.push(newName);

                  } else {
                    if (!that.isInFlyout) parserNames.push(blockName);
                  }
                } else {
                  if (!that.isInFlyout) parserNames.push(blockName);
                }
                break;

              case Blockly.Events.CHANGE:

                if (parserNames.length > 0 && !that.isInFlyout) {
                  var oldV = changeEvent.oldValue;
                  var newV = changeEvent.newValue;
                  if (oldV != newV) {
                    if (parserNames.includes(oldV)) {
                      var i = parserNames.indexOf(oldV);
                      parserNames.splice(i, 1);
                    }
                    if (!parserNames.includes(newV)) {
                      parserNames.push(newV);
                    }
                  }
                }
                //deletion is handled in workspace event listener
            }
          }
        });
      },

      //-------------------------------------------------------------------------
      // usage examples not currently used in this project

      // this extension generates the dropdown entries for the reference block

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
        addChangeHandler(this, function(changeEvent) {
          if (that.getInput('PARAM1').connection.targetBlock()) {
            that.setWarningText(null);
          } else {
            that.setWarningText('Must have an input block.');
          }
        });
      },


      // this extension depends on onchange-stack
      'onchange_set_parent_colour': function() {
        addChangeHandler(this, function(changeEvent) {
          var parent = that.getParent();
          if (parent) {
            parent.setColour(that.getColour());
          }
        });
      },

      // this extension depends on onchange-stack
      'onchange_get_parent_colour': function() {
        addChangeHandler(this, function(changeEvent) {
          var parent = that.getParent();
          if (parent) {
            that.setColour(parent.getColour());
          }
        })
      },

      'onchange_restore_default_colour': function() {
        addChangeHandler(this, function(changeEvent) {
          if (!that.getInput('PARAM1').connection.targetBlock()) {
            var myColour = that.type.substr(0, that.type.length - 5).toUpperCase() + '_HUE';
            that.setColour(Blockly.Msg[myColour]);
          }
        })
      },
    };

    var addChangeHandler = function(block, handler) {
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
    };

    var parserGeneratorLink = {};

    Extensions.init = function(extensionList) {
      for (extension of extensionList) {
        if (typeof extensions[extension] !== 'function') {
          console.log('Extension ' + extension + ' not implemented yet. Stub inserted.');
          var that = {};
          that.extension = extension;
          var code = function() {
            console.log('Stub for extension ' + that.extension + ' which is not implemented yet.');
          };
        } else {
          var code = extensions[extension];
        }
        Blockly.Extensions.register(extension, code);
      }
    };


    Extensions.linkParserToGenerator = function(bType, assoc) {
      parserGeneratorLink[bType] = assoc;
    };


    return Extensions;

  })(Extensions || {}, mxcParsec);

console.log('Public interface of Extensions:', Extensions);