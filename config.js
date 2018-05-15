var Config = {};

String.prototype.toUnderScore = function() {
    return this.replace(/\.?([A-Z]+)/g, function (x,y){return '_' + y.toLowerCase()}).replace(/^_/, '');
}

String.prototype.toCamelCase = function() {
    return this.replace(/_+/g,' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/[\s]+/g, '');
}

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
          msg = msg.replace('%title%', this.title)
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

JsonBlockBuilder.prototype.addInput = function(idx, input, msg) {
    var m = 'message' + idx;
    var a = 'args' + idx;
    var msg = msg ? msg : this.prefix + ('MSG'+idx)+'} %%';


    if (this.block[a]) {
        this.block[a].push(input);
        this.block[m].push(msg);
    } else {
        this.block[a] = [input];
        this.block[m] = [msg];
    }
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

JsonBlockBuilder.prototype.addParserConnections = function(accept) {
    accept = accept === undefined ? 'parser' : accept;
    this.block.nextStatement = accept;
    this.block.previousStatement = accept;
    return this;
}

JsonBlockBuilder.prototype.createBlock = function(bType, proto) {
    this.create(bType);
    switch(proto) {
        case 'no_args':
            return this
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .addParserConnections()
                .get();

        case 'char':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value', check:'char_negate'}, '%% %message%')
                .addInput(0, {type:'input_value', check:['char_input', 'char_all']}, '%%')
                .inputsInline(true)
                .get();

        case 'char':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value', check:'char_negate'}, '%% %message%')
                .addInput(0, {type:'input_value', check:['char_input', 'char_all']}, '%%')
                .inputsInline(true)
                .get();

        case 'integer_accept_all':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value',check:'integer_select'}, '%% %message%')
                .addInput(0, {type:'input_value',check:['integer_input', 'integer_all']}, '%%')
                .inputsInline(true)
                .get();


        case 'binary_accept_all':
        case 'float_accept_all':
            var type = proto.substr(0,proto.indexOf('_'));
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value',check:[type + '_input', type + '_all']}, '%message% %%')
                .inputsInline(true)
                .get();

        case 'char_input':
            return this
                .addInput(0, {type:'field_input',text:'a',check:'string'}, '%%')
                .setOutput('char_input')
                .get();

        case 'no_skip':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value', check:['preskipper', 'preskipper_all']}, '%message% %%')
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .inputsInline(true)
                .get();


        case 'binary_input':
        case 'float_input':
        case 'integer_input':
            return this
                .addInput(0, {type:'field_number',text:123}, '%%')
                .setOutput(proto)
                .get();

        case 'char_set_input':
            return this
                .addInput(0, {type:'field_input',text:'A-Z0-9',check:'string'}, '%message% %%')
                .setOutput('char_input')
                .get();

        case 'char_range_input':
            return this
                .addInput(0, {type:'field_input',text:'0'}, '%message% %%')
                .addInput(0, {type:'field_input',text:'9'}, '%message% %%')
                .setOutput('char_input')
                .get();

        case 'integer_range_input':
            return this
                .addInput(0, {type:'field_number',value:0}, '%message% %%')
                .addInput(0, {type:'field_number',value:9}, '%message% %%')
                .setOutput('integer_input')
                .get();

        case 'integer_digits_input':
            return this
                .addInput(0, {type:'field_number',value:0}, '%message% %%')
                .addInput(0, {type:'field_number',value:9}, '%message% %%')
                .setOutput('integer_input')
                .get();

        case 'char_class_input':
            return this
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .setOutput('char_input')
                .get();

        case 'string':
            return this
                .addParserConnections()
                .addInput(0, {type:'field_input',text:'string'}, '%message% %%')
                .inputsInline(true)
                .get();

        case 'float':
        case 'integer':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value',check:proto}, '%message% %%')
                .inputsInline(true)
                .get();

        case 'binary':
            return this
                .addParserConnections()
                .addInput(0,{type:'input_value', check:['binary_input', 'binary_all']}, '%message% %%')
                .addInput(0,{type:'input_value', check:'endianness'}, '%%')
                .inputsInline(true)
                .get();

        case 'single_parser':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .get();

        case 'dual_parser':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .addInput(0, {type:'input_statement',check:'parser'}, '%%')
                .get();

        case 'integer_field':
            return this
                .addParserConnections()
                .addInput(0, {type:'field_number',check:'integer'}, '%message% %%')
                .inputsInline(true)
                .get();

        case 'accept_all':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_value'}, '%message% %%')
                .inputsInline(true)
                .get();


        case 'grammar':
            return this
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .addInput(1, {type:'field_input', text:'new grammar'}, '%message% %%')
                .addInput(2,{type:'input_dummy'}, '%message% %%')
                .addInput(3,{type:'input_statement', check:'reference'}, '%%')
                .addInput(4,{type:'field_dropdown',options:[['hello','hello'], ['world', 'world']]}, '%message% %%')
                .get();

        case 'rule':
            return this
                .addInput(0, {type:'input_dummy'},'%message% %%')
                .addInput(1, {type:'field_input', text:'new rule'}, '%message% %%')
                .addInput(2,{type:'input_dummy'}, '%message% %%')
                .addInput(3,{type:'input_statement',check:'parser'},  '%%')
                .get();

        case 'ref':
            return this
                .addParserConnections()
                .addInput(0, {type:'input_dummy'},'%message% %%')
                .addInput(1, {type:'field_dropdown', options:[['hello','hello'], ['world', 'world']]}, '%message% %%')
                .get();

        case 'binary_all':
        case 'char_all':
        case 'integer_all':
        case 'float_all':
        case 'preskipper_all':
            return this
                .addInput(0, {type:'input_dummy'}, '%%')
                .setOutput(proto)
                .get();

        default:
            return this
                .addInput(0, {type:'input_dummy'}, '%message% %%')
                .setOutput(proto)
                .get();
     }
}

Config.shadows = {
        'allNullShadow':     [['value','PARAM1','shadow','integer_all_type']],

        'negateShadow':      [['value', 'PARAM1', 'shadow', 'char_negate_true_type'],
                              ['value', 'PARAM1', 'block', 'char_negate_false_type'],
                              ['value', 'PARAM2', 'shadow', 'char_set_input_type'],
                              ['value', 'PARAM2', 'block', 'char_all_type']],

        'byteShadow':        [['value', 'PARAM1', 'shadow', 'binary_input_type'],
                              ['value', 'PARAM1', 'block', 'binary_all_type']],

        'floatShadow':       [['value', 'PARAM1', 'shadow', 'float_input_type'],
                              ['value', 'PARAM1', 'block', 'float_all_type']],

        'binaryShadow':      [['value', 'PARAM1', 'shadow', 'binary_input_type'],
                              ['value', 'PARAM1', 'block', 'binary_all_type'],
                              ['value', 'PARAM2', 'shadow', 'native_endian_type'],
                              ['value', 'PARAM2', 'block', 'little_endian_type']],

        'integerShadow':     [['value', 'PARAM1', 'block', 'dec_select_type'],
                              ['value', 'PARAM2', 'shadow', 'integer_range_input_type'],
                              ['value', 'PARAM2', 'block', 'integer_all_type']],

        'nonDecShadow':      [['value', 'PARAM1', 'shadow', 'nd_input_type'],
                              ['value', 'PARAM1', 'block', 'nd_all_type']],

        'preSkipperShadow':  [['value', 'PARAM1', 'shadow', 'preskipper_type'],
                              ['value', 'PARAM1', 'block', 'preskipper_all_type']],
}

Config.categories = [{
        ref: 'catRule',
        proto: 'undone',
        blocks: [
            {type:'rule_type', proto:'rule'},
            {type:'grammar_type', proto: 'grammar'},
            {type:'reference_type', proto: 'ref' }
        ]
    },
    {},
    {
        ref: 'catDirective',
        proto: 'single_parser',
        blocks: [
            {type:'matches_type'},
            {type:'omit_type'},
            {type:'hold_type'},
            {type:'as_string_type'},
            {type:'no_case_type'},
            {type:'expect_type'},
            {type:'raw_type'},
            {type:'repeat_type', proto:'undone'}
        ]
    }, {
        ref:'catLoops',
        proto: 'single_parser',
        blocks:[
            {type:'kleene_type'},
            {type:'plus_type'},
            {type:'optional_type'},
            {type:'alternative_type'},
            {type:'sequence_type'},
            {type:'permutation_type'},
            {type:'sequential_or_type'},
            {type:'difference_type', proto:'dual_parser'},
            {type:'list_type', proto:'dual_parser'},
        ]
    }, {
        ref: 'catPredicate',
        proto: 'single_parser',
        blocks: [
            {type:'not_type'},
            {type:'and_type'}
        ]
    },
    {
        ref: 'catSkipper',
        proto: 'single_parser',
        blocks: [
            {type:'preskipper_all_type', proto: 'preskipper_all', shadow:'none', },
            {type:'preskipper_type', proto: 'preskipper', shadow:'none', },
            {type:'skipper_type', proto:'dual_parser'},
            {type:'skip_type', proto:'single_parser'},
            {type:'no_skip_type',proto:'no_skip',shadow:"preSkipperShadow"},
//            {type:'lexeme_type', proto:'no_skip'},

        ]
    },
    {},
    {
        ref: 'catString',
        blocks: [
            {type:'string_type',proto: 'string'},
            {type:'lit_type', proto: 'string'},
            {type:'symbols_type'}
        ]
    }, {
        ref: 'catChar',
        proto: 'char_class_input',
        blocks: [
            {type:'eol_type', proto: 'no_args'},
            {type:'eoi_type', proto: 'no_args'},
            {type:'char_negate_false_type', proto:'char_negate'},
            {type:'char_negate_true_type', proto:'char_negate'},
            {type:'char_type', proto: 'char', shadow:'negateShadow'},
            {type:'char_all_type', proto: 'char_all'},
            {type:'char_input_type', proto:'char_input'},
            {type:'char_range_input_type', proto:'char_range_input'},
            {type:'char_set_input_type', proto:'char_set_input'},
            {type:'digit_type'},
            {type:'xdigit_type'},
            {type:'alpha_type'},
            {type:'alnum_type'},
            {type:'lower_type'},
            {type:'graph_type'},
            {type:'upper_type'},
            {type:'punct_type'},
            {type:'print_type'},
            {type:'cntrl_type'},
            {type:'space_type'},
            {type:'blank_type'}
        ]
    },
    {},
    {
        ref:'catBoolean',
        blocks: [
            {type:'all_null_type', proto: 'all_null', shadow:'none', },
            {type:'bool_type', proto: 'undone'},
            {type:'true_type'},
            {type:'false_type'}
        ]
    }, {
        ref:'catInteger',
        proto: 'integer_select',
        blocks: [
            {type:'integer_type', proto: 'integer_accept_all',shadow:'integerShadow'},
            {type:'integer_all_type', proto: 'integer_all' },
            {type:'integer_input_type', proto: 'integer_input'},
            {type:'integer_range_input_type', proto: 'integer_range_input'},
            {type:'integer_digits_input_type', proto: 'integer_digits_input'},
            {type:'dec_select_type'},
            {type:'bin_select_type'},
            {type:'oct_select_type'},
            {type:'hex_select_type'},
            {type:'ushort_select_type'},
            {type:'uint_select_type'},
            {type:'ulong_select_type'},
            {type:'ulonglong_select_type'},
            {type:'short_select_type'},
            {type:'int_select_type'},
            {type:'long_select_type'},
            {type:'longlong_select_type'},
        ]
    }, {
        ref:'catFloat',
        shadow:'floatShadow',
        proto: 'float_accept_all',
        blocks: [
            {type:'float_all_type', proto: 'float_all', shadow:'none', },
            {type:'float_input_type', proto: 'float_input', shadow:'none', },
            {type:'float_type'},
            {type:'double_type'},
            {type:'long_double_type'},
        ]
    },
    {},
    {
        ref: 'catBinary',
        shadow:'binaryShadow',
        proto:'binary',
        blocks: [
            {type:'binary_all_type', proto: 'binary_all', shadow:'none', },
            {type:'binary_input_type', proto: 'binary_input', shadow:'none', },
            {type:'byte_type', proto:'binary_accept_all', shadow:'byteShadow'},
            {type:'word_type'},
            {type:'dword_type'},
            {type:'qword_type'},
            {type:'bin_float_type'},
            {type:'bin_double_type'},
            {type:'little_endian_type', proto: 'endianness', shadow:'none'},
            {type:'big_endian_type', proto: 'endianness', shadow:'none'},
            {type:'native_endian_type', proto: 'endianness', shadow:'none'},
        ]
    },
    {},
    {
        ref:'catAuxiliary',
        blocks: [
            {type:'eps_type', proto: 'no_args'},
            {type:'attr_type', proto: 'accept_all' },
            {type:'lazy_type', proto: 'single_parser'},
            {type:'advance_type', proto: 'integer_field'},
        ]
    }
];

Config.getBlocks = function() {
    var json = [];
    var builder = new JsonBlockBuilder();
    for (var cat of Config.categories) {
        if (Object.keys(cat).length === 0) {
            continue;
        }
        var blocks = cat.blocks;
        for (var block of blocks) {
            var bType = block.type;
            var proto = block['proto'] ? block['proto'] : cat['proto'] ? cat['proto'] : 'undone';
            json.push(builder.createBlock(bType, proto));
            if (proto === 'float_accept_all') {
                console.log(builder.createBlock(bType, proto));
            }
        }
    }
    return json;
}

Config.setupMessages = function() {
    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name='%{BKY_CATLOGIC}'>`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    var addBlockMessage = function(mkey, topic) {
        key = mkey.substr(5);
        len = key.length-topic.length;
        if (key.indexOf(topic) === len) {
            key = key.substr(0,len).toUnderScore().toUpperCase() + '_' + topic.toUpperCase();
            Blockly.Msg[key] = MSG[mkey];
            return true;
        }
        return false;
    }

    for (var messageKey in MSG) {
        if (messageKey.indexOf('cat') == 0) {
            if (messageKey.indexOf('Hue') === messageKey.length-3) {
                key = messageKey.substr(0,messageKey.length-3);
                key = key.toUpperCase()+'_HUE';
                Blockly.Msg[key] = MSG[messageKey];
            } else {
                Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
            }
        } else if (messageKey.indexOf('block') == 0) {
            if (addBlockMessage(messageKey, 'Tooltip')) {
                continue;
            };
            if (addBlockMessage(messageKey, 'HelpUrl')) {
                continue;
            };
            if (addBlockMessage(messageKey, 'Title')) {
                continue;
            }
            // todo: ouchn
            if (addBlockMessage(messageKey, 'Msg1')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg2')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg3')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg4')) {
                continue;
            }
            if (addBlockMessage(messageKey, 'Msg5')) {
                continue;
            }
        }
    }
}

Config.createSubs = function(config) {
    var xml = '';
    console.log(config);
    for (var v of config) {
        xml += '<' + v[0] + ' name="' + v[1] + '"><' + v[2] + ' type="' + v[3] + '"></' + v[2] + '></value>'
    }
    return xml;
}


Config.getToolbox = function() {
    // generate the toolbox XML
    var toolbox = '<xml>';
    for (var cat of Config.categories) {
        if (Object.keys(cat).length === 0) {
            toolbox += '<sep></sep>';
            continue;
        }
        var ref = cat.ref.toUpperCase();
        var colour = Blockly.Msg[ref+'_HUE'];
        toolbox += '<category name="'+ '%{BKY_' + ref + '}"  colour="'+ '%{BKY_' + ref + '_HUE}' + '">';
        var blocks = cat.blocks;
        for (var block of blocks) {
            var bType = block.type;
            var colourKey = bType.substr(0,bType.length-5).toUpperCase()+'_HUE';
            Blockly.Msg[colourKey] = block.colour ? block.colour : colour;
            toolbox += '<block type="' + bType + '">';
            var shadow = block['shadow'] ? block['shadow'] : cat['shadow'] ? cat['shadow'] : 'none';
            if (shadow !== 'none') {
                toolbox += this.createSubs(Config.shadows[shadow]);
            }
            toolbox += '</block>';
        }
        toolbox += '</category>';
    }
    toolbox +='</xml>';

    return toolbox;
};

