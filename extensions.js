
var Extensions = {};

Extensions.pgAssoc = {};

Extensions.extensions ={

    'register_generator': function() {
        var obj = Extensions.pgAssoc[this.type];
        this.data = obj.data;
        this.generator = obj.generator;
        Blockly.PHP[this.type] = Generator.generators.php[this.generator];
//        console.log("Code generator for " + this.type + ": " + this.generator);
//        console.log("Parser for " + this.type + ": " + this.parser);
    },

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
