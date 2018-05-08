var Config = {};

String.prototype.toUnderScore = function() {
    return this.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
}

String.prototype.toCamelCase = function() {
    return this.replace('_',' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/[\s]+/g, '');
}

function JsonBlockBuilder() {
}

JsonBlockBuilder.prototype.get = function() {
    return this.block;
}

JsonBlockBuilder.prototype.create = function(bType) {
    this.ubType = bType.toUpperCase();
    prefix = "%{BKY_" + this.ubType + "_";
    helpUrl = prefix + "HELPURL}";
    tooltip = prefix + "TOOLTIP}";
    colour =  prefix + "HUE}";
    this.prefix = prefix;

    this.block = {type:bType, "helpUrl":helpUrl, "tooltip":tooltip, "colour":colour};
    return this;
}

JsonBlockBuilder.prototype.addInput = function(idx, input, msg) {
    var m = "message" + idx;
    var a = "args" + idx;
    var msg = msg ? msg : this.prefix + ("MSG"+idx)+"} %%";


    if (this.block[a]) {
        if (input.name === undefined) {
            input.name="PARAM_" + this.block[a].length;
        }
        this.block[a].push(input);
        msg = msg.replace("%%", "%" + this.block[a].length);
        this.block[m].push(msg);

    } else {
        if (input.name === undefined) {
            input.name="PARAM_1";
        }
        msg = msg.replace("%%", "%1");
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

JsonBlockBuilder.prototype.addHeader = function() {
    this.addInput(0, {type:"input_dummy"}, "%{BKY_" + this.ubType + "_TITLE}");
    return this;
};

JsonBlockBuilder.prototype.addParserConnections = function(accept) {
    accept = accept === undefined ? "parser" : accept;
    this.block.nextStatement = accept;
    this.block.previousStatement = accept;
    return this;
}

JsonBlockBuilder.prototype.createBlock = function(bType, desc) {
    this.create(bType);
    switch(desc) {

        case 'no_args':
            return this.addHeader()
                .addParserConnections()
                .get();

        case 'char':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"field_input","text":"c"}, "%% :")
                .addInput(1, {type:"field_checkbox","checked":false}, "negate %%")
                .inputsInline(true)
                .get();

        case 'char_set':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"field_input","text":"A-Z0-9"}, "%% :")
                .addInput(1, {type:"field_checkbox","checked":false}, "negate %%")
                .inputsInline(true)
                .get();

        case 'char_class':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"field_checkbox","checked":false}, "negate %%")
                .inputsInline(true)
                .get();

        case 'char_range':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"field_input","text":"0",check:"string"}, "from %%")
                .addInput(1, {type:"field_input","text":"9",check:"string"}, "to %% :")
                .addInput(1, {type:"field_checkbox","checked":false}, "negate %%")
                .inputsInline(true)
                .get();

        case 'string':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"field_input","text":"string",check:"string"}, "%%")
                .inputsInline(true)
                .get();

        case 'integer':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"input_value",check:["integer", "all_null"]}, "%%")
                .get();

        case 'float':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"input_value",check:["float", "all_null"]}, "%%")
                .get();

        case 'single_parser':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"input_statement",check:"parser"}, "%%")
                .get();

        case 'dual_parser':
            return this
                .addHeader()
                .addParserConnections()
                .addInput(1, {type:"input_statement",check:"parser"}, "%%")
                .addInput(1, {type:"input_statement",check:"parser"}, "%%")
                .get();

        case "all_null":
            return this
                .setOutput("all_null")
                .get();
     }
}

Config.blocks = [

    {type:"all_null_type",                                           block:"all_null"},
    {type:"eol_type",                 parser:"eol",                  block:"no_args"},
    {type:"eoi_type",                 parser:"eoi",                  block:"no_args"},
    {type:"eps_type",                 parser:"eps",                  block:"no_args"},
    {type:"true_type",                parser:"true",                 block:"no_args"},
    {type:"false_type",               parser:"false",                block:"no_args"},

    {type:"digit_type",               parser:"digit",                block:"char_class"},
    {type:"xdigit_type",              parser:"xdigit",               block:"char_class"},
    {type:"alpha_type",               parser:"alpha",                block:"char_class"},
    {type:"alnum_type",               parser:"alnum",                block:"char_class"},
    {type:"lower_type",               parser:"lower",                block:"char_class"},
    {type:"graph_type",               parser:"graph",                block:"char_class"},
    {type:"upper_type",               parser:"upper",                block:"char_class"},
    {type:"punct_type",               parser:"punct",                block:"char_class"},
    {type:"print_type",               parser:"print",                block:"char_class"},
    {type:"cntrl_type",               parser:"cntrl",                block:"char_class"},
    {type:"space_type",               parser:"space",                block:"char_class"},
    {type:"blank_type",               parser:"blank",                block:"char_class"},

    {type:"charset_type",             parser:"charset",              block:"char_set"},
    {type:"charrange_type",           parser:"charrange",            block:"char_range"},
    {type:"char_type",                parser:"char",                 block:"char"},
    {type:"string_type",              parser:"string",               block:"string"},
    {type:"lit_type",                 parser:"lit",                  block:"string"},

    {type:"omit_type",                parser:"omit",                 block:"single_parser"},
    {type:"lexeme_type",              parser:"lexeme",               block:"single_parser"},
    {type:"no_skip_type",             parser:"no_skip",              block:"single_parser"},
    {type:"hold_type",                parser:"hold",                 block:"single_parser"},
    {type:"as_string_type",           parser:"as_string",            block:"single_parser"},
    {type:"no_case_type",             parser:"no_case",              block:"single_parser"},
    {type:"expect_d_type",            parser:"expect_d",             block:"single_parser"},
    {type:"raw_type",                 parser:"raw",                  block:"single_parser"},
    {type:"matches_type",             parser:"matches",              block:"single_parser"},

    {type:"not_type",                 parser:"not",                  block:"single_parser"},
    {type:"and_type",                 parser:"and",                  block:"single_parser"},

    {type:"lazy_type",                parser:"lazy",                 block:"single_parser"},

    {type:"kleene_type",              parser:"kleene",               block:"single_parser"},
    {type:"plus_type",                parser:"plus",                 block:"single_parser"},
    {type:"optional_type",            parser:"optional",             block:"single_parser"},

    {type:"alternative_type",         parser:"alternative",          block:"single_parser"},
    {type:"sequence_type",            parser:"sequence",             block:"single_parser"},
    {type:"permutation_type",         parser:"permutation",          block:"single_parser"},
    {type:"sequential_or_type",       parser:"sequential_or",        block:"single_parser"},

    {type:"expect_type",              parser:"expect",               block:"dual_parser"},
    {type:"list_type",                parser:"list",                 block:"dual_parser"},
    {type:"difference_type",          parser:"difference",           block:"dual_parser"},
    {type:"skip_type",                parser:"skip",                 block:"dual_parser"},

    {type:"ushort_type",              parser:"ushort",               block:"single_integer_all"},
    {type:"uint_type",                parser:"uint",                 block:"single_integer_all"},
    {type:"ulong_type",               parser:"ulong",                block:"single_integer_all"},
    {type:"ulong_long_type",          parser:"ulong_long",           block:"single_integer_all"},

    {type:"short_type",               parser:"short",                block:"single_integer_all"},
    {type:"int_type",                 parser:"int",                  block:"single_integer_all"},
    {type:"long_type",                parser:"long",                 block:"single_integer_all"},
    {type:"long_long_type",           parser:"long_long",            block:"single_integer_all"},

    {type:"bin_type",                 parser:"bin",                  block:"single_integer_all"},
    {type:"oct_type",                 parser:"oct",                  block:"single_integer_all"},
    {type:"hex_type",                 parser:"hex",                  block:"single_integer_all"},

    {type:"byte_type",                parser:"byte",                 block:"single_integer_all"},
    {type:"word_type",                parser:"word",                 block:"single_integer_all"},
    {type:"dword_type",               parser:"dword",                block:"single_integer_all"},
    {type:"qword_type",               parser:"qword",                block:"single_integer_all"},

    {type:"big_word_type",            parser:"big_word",             block:"single_integer_all"},
    {type:"big_dword_type",           parser:"big_dword",            block:"single_integer_all"},
    {type:"big_qword_type",           parser:"big_qword",            block:"single_integer_all"},

    {type:"little_word_type",         parser:"little_word",          block:"single_integer_all"},
    {type:"little_dword_type",        parser:"little_dword",         block:"single_integer_all"},
    {type:"little_qword_type",        parser:"little_qword",         block:"single_integer_all"},

    {type:"float_type",               parser:"float",                block:"single_float_all"},
    {type:"double_type",              parser:"double",               block:"single_float_all"},
    {type:"long_double_type",         parser:"long_double",          block:"single_float_all"},

    {type:"bin_float_type",           parser:"bin_float",            block:"single_float_all"},
    {type:"bin_double_type",          parser:"bin_double",           block:"single_float_all"},

    {type:"big_bin_float_type",       parser:"big_bin_float",        block:"single_float_all"},
    {type:"big_bin_double_type",      parser:"big_bin_double",       block:"single_float_all"},

    {type:"little_bin_float_type",    parser:"little_bin_float",     block:"single_float_all"},
    {type:"little_bin_double_type",   parser:"little_bin_double",    block:"single_float_all"},

    {type:"all_null_type",            parser:"all_null",             block:"all_null"},

    {type:"rule_type",                parser:"rule",                 block:"rule"},
    {type:"grammar_type",             parser:"grammar",              block:"grammar"},
    {type:"ruleref_type",             parser:"ruleref",              block:"ruleref"},

    {type:"repeat_type",              parser:"repeat"},
    {type:"symbols_type",             parser:"symbols"},

    {type:"bool_type",                parser:"bool"},

    {type:"attr_type",                parser:"attr"},
    {type:"advance_type",             parser:"advance"}
];

Config.checks = {
        no_args:        null,
        parser:         "parser",
        integer:        "integer",
        string:         "string",
        integer_all:    [ "integer",    "all_null_type"],
        float_all:      [ "float",      "all_null_type"],
    };

Config.inputs = {
      "single_float_all":       {block: "single_value_inline",  checks:Config.checks.float_all},
      "single_integer_all":     {block: "single_value_inline",  checks:Config.checks.integer_all},
      "single_parser":          {block: "single_parser",        checks:Config.checks.parser},
      "dual_parser":            {block: "dual_parser",          checks:Config.checks.parser},
      "single_parser":          {block: "dual_parser",          checks:Config.checks.parser},
      "char_set":               {block: "char_set",             checks:Config.checks.string},
      "char_range":             {block: "char_range",           checks:Config.checks.string},
      "char":                   {block: "char",                 checks:Config.checks.string},
      "string":                 {block: "char",                 checks:Config.checks.string},
      "no_args":                {block: "no_args",              checks:Config.checks.no_args},
}

Config.allNullShadow = '<value name="param"><shadow type="all_null_type"></shadow></value>';

Config.categories = [{
    ref: 'CATRULE',
    colour:"225",
    blocks: [
        {type:"rule_type"},
        {type:"grammar_type" },
        {type:"ruleref_type" }
    ]
},
{},
{
    ref: 'CATDIRECTIVE',
    colour:"210",
    blocks: [
        {type:"matches_type"},
        {type:"omit_type"},
        {type:"lexeme_type"},
        {type:"skip_type"},
        {type:"no_skip_type"},
        {type:"hold_type"},
        {type:"as_string_type"},
        {type:"no_case_type"},
        {type:"expect_d_type"},
        {type:"raw_type"},
        {type:"repeat_type"}
    ]
},
{
    ref: 'CATPREDICATE',
    colour:"195",
    blocks: [
        {type:"not_type"},
        {type:"and_type"}
    ]
},
{},
{
    name:"Char Classifiers",
    ref: 'CATCHARCLASS',
    colour:"180",
    blocks: [
        {type:"digit_type"},
        {type:"xdigit_type"},
        {type:"alpha_type"},
        {type:"alnum_type"},
        {type:"lower_type"},
        {type:"graph_type"},
        {type:"upper_type"},
        {type:"punct_type"},
        {type:"print_type"},
        {type:"cntrl_type"},
        {type:"space_type"},
        {type:"blank_type"}
    ]
}, {
    ref: "CATCHAR",
    colour:"165",
    blocks: [
        {type:"charrange_type"},
        {type:"charset_type"},
        {type:"char_type"},
    ]
}, {
    ref: "CATSTRING",
    colour:"150",
    blocks: [
        {type:"string_type"},
        {type:"symbols_type"},
        {type:"lit_type"}
    ]
},
{},
{
    ref:"CATBOOLEAN",
    colour:"135",
    blocks: [
        {type:"bool_type"},
        {type:"true_type"},
        {type:"false_type"}
    ]
}, {
    ref:"CATDECIMAL",
    colour:"120",
    blocks: [
        {type:"all_null_type"},
        {type:"ushort_type",        shadow:Config.allNullShadow},
        {type:"uint_type",          shadow:Config.allNullShadow},
        {type:"ulong_type",         shadow:Config.allNullShadow},
        {type:"ulong_long_type",    shadow:Config.allNullShadow},
        {type:"short_type",         shadow:Config.allNullShadow},
        {type:"int_type",           shadow:Config.allNullShadow},
        {type:"long_type",          shadow:Config.allNullShadow},
        {type:"long_long_type",     shadow:Config.allNullShadow},
    ]
}, {
    ref:"CATFLOAT",
    colour:"105",
    blocks: [
        {type:"float_type",         shadow:Config.allNullShadow},
        {type:"double_type",        shadow:Config.allNullShadow},
        {type:"long_double_type",   shadow:Config.allNullShadow},
    ]
}, {
    ref:"CATNONDECIMAL",
    colour:"90",
    blocks: [
        {type:"bin_type",           shadow:Config.allNullShadow},
        {type:"oct_type",           shadow:Config.allNullShadow},
        {type:"hex_type",           shadow:Config.allNullShadow},
    ]
},
{},
{
    ref:"CATBINARY",
    colour:"75",
    blocks: [
        {type:"byte_type", shadow:Config.allNullShadow},
        {type:"word_type", shadow:Config.allNullShadow},
        {type:"dword_type", shadow:Config.allNullShadow},
        {type:"qword_type", shadow:Config.allNullShadow},
        {type:"bin_float_type", shadow:Config.allNullShadow},
        {type:"bin_double_type", shadow:Config.allNullShadow},
        {type:"big_word_type", shadow:Config.allNullShadow},
        {type:"big_dword_type", shadow:Config.allNullShadow},
        {type:"big_qword_type", shadow:Config.allNullShadow},
        {type:"big_bin_float_type", shadow:Config.allNullShadow},
        {type:"big_bin_double_type", shadow:Config.allNullShadow},
        {type:"little_word_type", shadow:Config.allNullShadow},
        {type:"little_dword_type", shadow:Config.allNullShadow},
        {type:"little_qword_type", shadow:Config.allNullShadow},
        {type:"little_bin_float_type", shadow:Config.allNullShadow},
        {type:"little_bin_double_type", shadow:Config.allNullShadow},
    ]
},
{},
{
    ref:"CATUNARYOP",
    colour:"60",
    blocks: [
        {type:"kleene_type"},
        {type:"plus_type"}
    ]
}, {
    ref:"CATBINARYOP",
    colour:"45",
    blocks: [
        {type:"expect_type"},
        {type:"difference_type"},
        {type:"list_type"}
    ]
}, {
    ref:"CATNARYOP",
    colour:"30",
    blocks: [
        {type:"alternative_type"},
        {type:"sequence_type"},
        {type:"permutation_type"},
        {type:"sequential_or_type"}
    ]
},
{},
{
    ref:"CATAUX",
    colour:"15",
    blocks: [
        {type:"eol_type"},
        {type:"attr_type"},
        {type:"eoi_type"},
        {type:"eps_type"},
        {type:"lazy_type"},
        {type:"advance_type"}
    ]
}];

Config.getBlocks = function() {
    for(var block of this.blocks) {
    }
}

Config.getToolbox = function() {

    this.getBlocks();

    // The toolbox XML specifies each category name using Blockly's messaging
    // format (eg. `<category name="%{BKY_CATLOGIC}">`).
    // These message keys need to be defined in `Blockly.Msg` in order to
    // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
    // been defined for each language to import each category name message
    // into `Blockly.Msg`.
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    for (var messageKey in MSG) {
        if (messageKey.indexOf('cat') == 0) {
            Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
        }
    }

    // generate the toolbox XML
    var toolbox = '<xml>';
    for (var cat in Config.categories) {
        if (Object.keys(Config.categories[cat]).length === 0) {
            toolbox += '<sep></sep>';
            continue;
        }
        var catCol = Config.categories[cat].colour;
        var ref = Config.categories[cat].ref;
        var catColConst = ref + "_HUE";
        Blockly.Msg[Config.categories[cat].ref + "_HUE"] = catCol;
        catColConst = "%{BKY_" + catColConst + "}";
        var catNameConst = "%{BKY_" + ref + "}";
        toolbox += '<category name="'+ catNameConst+ '" colour="'+ catColConst+ '">';
        var blocks = Config.categories[cat].blocks;
        for (var block in blocks) {
            var bType = blocks[block].type;
            var blkCol = blocks[block]["colour"] ? blocks[block]["colour"] : catCol;
            Blockly.Msg[bType.toUpperCase() + '_HUE'] = blkCol;

            toolbox += '<block type="' + bType + '">';
            if (blocks[block]["shadow"]) {
                toolbox += blocks[block]["shadow"];
            }
            toolbox += '</block>';
        }
        toolbox += '</category>';
    }
    toolbox +='</xml>';

    return toolbox;
};

