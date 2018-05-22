var Extensions = {};

<<<<<<< HEAD
Extensions.pgAssoc = {};
=======
Extensions.extensions ={
    'use_parent_tooltip': function() {
        var that = this;
        this.setTooltip(function() {
            var parent = that.getParent();
            var myTooltip = that.type.substr(0,that.type.length-5).toUpperCase()+'_TOOLTIP';
            return (parent && parent.getInputsInline() && parent.tooltip) ||
                Blockly.Msg[myTooltip];
        });
    },

    // this extension generates the dropdown entries for the reference block
    'reference_dropdown': function(){
    	
    	var dropdown = new Blockly.FieldDropdown(dynamicReferenceOptions);
    	this.inputList[1].appendField(dropdown, 'PARAM1');
    		
    },
    
    // this extension handles the rule / grammar names for new blocks in the menu
    'oncreate_name_handler': function() {
    	var blockName = this.getFieldValue('PARAM1');
   //debugger;
    	//check if blockname already exists
    	if (parserNames.length>0){
    		if (parserNames.includes(blockName)){
    			while(parserNames.includes(blockName)){
    			
    				//compute new blockName
    				var i = 1;
    				var nameEnding  = blockName.substring(blockName.length - i);
    				var lastNumber = 1;
    				while(!isNaN(parseInt(nameEnding))){
    					lastNumber = parseInt(nameEnding);
    					i++;
    					nameEnding  = blockName.substring(blockName.length - i);
    				}
    			
    				var newName = blockName.substring(0,blockName.length - (i-1)) + (lastNumber + 1);
    				blockName = newName;
    				
    			
    			}
    			this.setFieldValue(newName, 'PARAM1');
    			
    		}else{
    			parserNames.push(blockName);
    		}
    	}else{
    		parserNames.push(blockName);	
    	}
    	
    },
    
    // this extension handles name changes for rule and grammar blocks
    'onchange_name_handler': function() {
    	var that = this;
    	this.addChangeHandler(function(changeEvent) {

    		var blockName = that.getFieldValue('PARAM1');
    		var eventType = changeEvent.type; //Blockly.Events.CREATE
    		var blockID = that.id;
    		var eventID = changeEvent.blockId;

    		if (blockID == eventID) {
    			//debugger;
    			switch(eventType){

    			case Blockly.Events.CREATE: 
    				//check if blockname already exists
    				if (parserNames.length>0){
    					if (parserNames.includes(blockName)){
    						while(parserNames.includes(blockName)){

    							//compute new blockName
    							var i = 1;
    							var nameEnding  = blockName.substring(blockName.length - i);
    							var lastNumber = 1;
    							while(!isNaN(parseInt(nameEnding))){
    								lastNumber = parseInt(nameEnding);
    								i++;
    								nameEnding  = blockName.substring(blockName.length - i);
    							}

    							var newName = blockName.substring(0,blockName.length - (i-1)) + (lastNumber + 1);
    							blockName = newName;


    						}
    						that.setFieldValue(newName, 'PARAM1');
    						if(!that.isInFlyout) parserNames.push(newName);

    					}else{
    						if(!that.isInFlyout) parserNames.push(blockName);
    					}
    				}else{
    					if(!that.isInFlyout) parserNames.push(blockName);	
    				}
    				break;

    			case Blockly.Events.CHANGE:

    				if (parserNames.length>0 && !that.isInFlyout ){
    					var oldV = changeEvent.oldValue;
    					var newV = changeEvent.newValue;
    					if (oldV != newV){
    						if (parserNames.includes(oldV)){
    							var i= parserNames.indexOf(oldV);
    							parserNames.splice(i,1);
    						}
    						if (!parserNames.includes(newV)){
    							parserNames.push(newV);
    						}
    					}
    				}
    				break;
    			case Blockly.Events.DELETE:
    				if (parserNames.includes(blockName)){
						var i= parserNames.indexOf(blockName);
						parserNames.splice(i,1);
					}
    			}
    		}
        });
    	
    },
    // this extension implements a stack of functions executed
    // when the block receives a change event
    'onchange_stack': function() {
        this.changeStack = [];
        var that = this;

        this.addChangeHandler = function(handler) {
            that.changeStack.push(handler);
        }
>>>>>>> Dynamic dropdown for reference block implemented

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

  // for debugging purposes
  'onchange_log_event': function() {
    Extensions.addChangeHandler(this, function(changeEvent) {
      console.log(changeEvent.toJson());
    });
  },

  // this extension generates the dropdown entries for the reference block
  'reference_dropdown': function(){

    var dropdown = new Blockly.FieldDropdown(dynamicReferenceOptions);
    this.inputList[1].appendField(dropdown, 'PARAM1');

  },
  // this extension handles name changes for rule and grammar blocks
  'onchange_name_handler': function() {
    var that = this;
    Extensions.addChangeHandler(this, function(changeEvent) {

      var blockName = that.getFieldValue('PARAM1');
      var eventType = changeEvent.type; //Blockly.Events.CREATE
      var blockID = that.id;
      var eventID = changeEvent.blockId;

      if (blockID == eventID) {
        //debugger;
        switch(eventType){

        case Blockly.Events.CREATE:
          //check if blockname already exists
          if (parserNames.length>0){
            if (parserNames.includes(blockName)){
              while(parserNames.includes(blockName)){

                //compute new blockName
                var i = 1;
                var nameEnding  = blockName.substring(blockName.length - i);
                var lastNumber = 1;
                while(!isNaN(parseInt(nameEnding))){
                  lastNumber = parseInt(nameEnding);
                  i++;
                  nameEnding  = blockName.substring(blockName.length - i);
                }

                var newName = blockName.substring(0,blockName.length - (i-1)) + (lastNumber + 1);
                blockName = newName;


              }
              that.setFieldValue(newName, 'PARAM1');
              if(!that.isInFlyout) parserNames.push(newName);

            }else{
              if(!that.isInFlyout) parserNames.push(blockName);
            }
          }else{
            if(!that.isInFlyout) parserNames.push(blockName);
          }
          break;

        case Blockly.Events.CHANGE:

          if (parserNames.length>0 && !that.isInFlyout ){
            var oldV = changeEvent.oldValue;
            var newV = changeEvent.newValue;
            if (oldV != newV){
              if (parserNames.includes(oldV)){
                var i= parserNames.indexOf(oldV);
                parserNames.splice(i,1);
              }
              if (!parserNames.includes(newV)){
                parserNames.push(newV);
              }
            }
          }
          //deletion is handled in workspace event listener
        }
      }
      });
  },

  // this extension handles the rule / grammar names for new blocks in the menu
//'oncreate_name_handler': function() {
//
//
//  var blockName = this.getFieldValue('PARAM1');
//
//
////debugger;
//  //check if blockname already exists
//  if (parserNames.length>0){
//    if (parserNames.includes(blockName)){
//      while(parserNames.includes(blockName)){
//
//        //compute new blockName
//        var i = 1;
//        var nameEnding  = blockName.substring(blockName.length - i);
//        var lastNumber = 1;
//        while(!isNaN(parseInt(nameEnding))){
//          lastNumber = parseInt(nameEnding);
//          i++;
//          nameEnding  = blockName.substring(blockName.length - i);
//        }
//
//        var newName = blockName.substring(0,blockName.length - (i-1)) + (lastNumber + 1);
//        blockName = newName;
//
//
//      }
//      this.setFieldValue(newName, 'PARAM1');
//
//    }else{
//      parserNames.push(blockName);
//    }
//  }else{
//    parserNames.push(blockName);
//  }
//
//},

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
    Extensions.addChangeHandler(this, function(changeEvent) {
      if (that.getInput('PARAM1').connection.targetBlock()) {
        that.setWarningText(null);
      } else {
        that.setWarningText('Must have an input block.');
      }
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