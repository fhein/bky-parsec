
var Extensions = {};

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

    // this extension implements a stack of functions executed
    // when the block receives a change event
    'onchange_stack': function() {
        this.changeStack = [];
        var that = this;

        this.addChangeHandler = function(handler) {
            that.changeStack.push(handler);
        }

        this.setOnChange(function(changeEvent) {
            for(var handler of that.changeStack) {
                handler(changeEvent);
            }
        })
    },

    // this extension depends on onchange-stack
    'onchange_warning_example': function() {
        var that = this;
        this.addChangeHandler(function(changeEvent) {
            if (that.getInput('PARAM1').connection.targetBlock()) {
                that.setWarningText(null);
            } else {
                that.setWarningText('Must have an input block.');
            }
        });
    },

    // this extension depends on onchange-stack
    'onchange_set_parent_colour': function() {
        var that = this;
        this.addChangeHandler(function(changeEvent) {
            var parent = that.getParent();
            if(parent) {
                parent.setColour(that.getColour());
            }
        });
    },

    // this extension depends on onchange-stack
    'onchange_get_parent_colour': function() {
        var that = this;
        this.addChangeHandler(function(changeEvent) {
            var parent = that.getParent();
            if(parent) {
                that.setColour(parent.getColour());
            }
        })
    },

    // this extension depends on onchange-stack
    'onchange_restore_default_colour': function() {
        var that = this;
        this.addChangeHandler(function(changeEvent) {
            if (!that.getInput('PARAM1').connection.targetBlock()) {
                var myColour = that.type.substr(0,that.type.length-5).toUpperCase()+'_HUE';
                that.setColour(Blockly.Msg[myColour]);
            }
        })
    },

    // this is work in progress
    // I want the state only on change and only if the
    // block is not dragged currently
    'onchange_became_topblock': function() {
        var that = this;
        this.topBlockEventCount = 0;
        this.addChangeHandler(function(changeEvent) {
            if (!that.getSurroundParent()) {
                that.topBlockEventCount++;
                if (that.topBlockEventCount === 3) {
                    // this works but it deletes the blocks
                    // from the toolbox also :/
                    //that.dispose();
                }
            } else {
                console.log(that.id+ ": false");
                that.topBlockEventCount = 0;
            }
        });
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
