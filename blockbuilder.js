function JsonBlockBuilder() {
}

JsonBlockBuilder.prototype.get = function() {

    var paramIdx = 1;

    for (var i = 0; this.block['args' + i]; i++) {
        for (var arg of this.block['args' + i]) {
            if (arg['type'] !== 'input_dummy') {
                arg['name'] = 'PARAM'+paramIdx++;
            }
        }
    }
    paramIdx = 1;
    for (var i = 0; this.block['message' + i]; i++) {
        var replace = '';
        var argParamIdx = 1;
        for (var msg of this.block['message'+i]) {
          msg = msg.replace('%message%', this.prefix + 'MSG'+ paramIdx++ +'}')
          msg = msg.replace('%%', '%' + argParamIdx++);
          replace += ' ' + msg;
        }
        this.block['message'+i] = replace;
    }
    return this.block;
}

JsonBlockBuilder.prototype.create = function(bType) {
    this.ubType = bType.toUpperCase().substr(0,bType.length-5);
    prefix = '%{BKY_' + this.ubType + '_';
    helpUrl = prefix + 'HELPURL}';
    tooltip = prefix + 'TOOLTIP}';
    colour =  prefix + 'HUE}';
    this.prefix = prefix;

    this.block = {type:bType, 'helpUrl':helpUrl, 'tooltip':tooltip, 'colour':colour};
    return this;
}

JsonBlockBuilder.prototype.setExtensions = function(extensions) {
    if (extensions) {
        this.block.extensions = extensions;
    }
    return this;
}

JsonBlockBuilder.prototype.getExtensions = function() {
    return this.extensions;
}

JsonBlockBuilder.prototype.addInput = function(idx, input, msg = '%message% %%') {
    var m = 'message' + idx;
    var a = 'args' + idx;

    if (!this.block[a]) {
        this.block[a] = [];
        this.block[m] = [];
    }
    this.block[a].push(input);
    this.block[m].push(msg);

    return this;
}

JsonBlockBuilder.prototype.inputsInline = function(b) {
    this.block.inputsInline = b ? b : undefined;
    return this;
}

JsonBlockBuilder.prototype.setOutput = function(b) {
    this.block.nextStatement = undefined;
    this.block.previousStatement = undefined;
    this.block.output = b ? b : null;
    return this;
}

JsonBlockBuilder.prototype.addParserConnections = function() {
    var accept = 'parser';
    this.block.nextStatement = accept;
    this.block.previousStatement = accept;
    return this;
}

