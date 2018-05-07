  Blockly.defineBlocksWithJsonArray([
	  {
		  "type": "integer_all_type",
		  "message0": "all",
		  "output": "integer",
		  "colour": 230,
		  "tooltip": "%{BKY_TOOLTIP_INTEGER_ALL}",
		  "helpUrl": "%{BKY_HELPURL_INTEGER_ALL}"
	  },
	  {
	  "type": "charparser",
	  "message0": "parse char %1 %2",
	  "args0": [
	    {
	      "type": "field_variable",
	      "name": "charParVarName",
	      "variable": "$varName"
	    },
	    {
	      "type": "input_value",
	      "name": "charParAtt",
	      "check": [
	        "char",
	        "charset"
	      ]
	    }
	  ],
	  "inputsInline": true,
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 210,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "rule",
	  "message0": "Rule %1 %2 Parse %3",
	  "args0": [
	    {
	      "type": "field_variable",
	      "name": "ruleName",
	      "variable": "name"
	    },
	    {
	      "type": "input_dummy"
	    },
	    {
	      "type": "input_statement",
	      "name": "ruleParser",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": [
	    "Grammar",
	    "Rule"
	  ],
	  "nextStatement": "Rule",
	  "colour": 0,
	  "tooltip": "%{BKY_TOOLTIP_RULE}",
	  "helpUrl": "%{BKY_HELPURL_RULE}"
	},
	{
	  "type": "grammar",
	  "message0": "Grammar %1 %2 Start Rule %3 %4 Parse Rules %5",
	  "args0": [
	    {
	      "type": "field_variable",
	      "name": "name",
	      "variable": "grammar1"
	    },
	    {
	      "type": "input_dummy"
	    },
	    {
	      "type": "field_variable",
	      "name": "startRuleName",
	      "variable": "rule1"
	    },
	    {
	      "type": "input_dummy"
	    },
	    {
	      "type": "input_statement",
	      "name": "grammarParser",
	      "check": "rule"
	    }
	  ],
	  "colour": 270,
	  "tooltip": "Multiple parsers will be accepted",
	  "helpUrl": ""
	},
	{
	  "type": "rulereference",
	  "message0": "Use Rule %1",
	  "args0": [
	    {
	      "type": "field_variable",
	      "name": "ruleName",
	      "variable": "rule1"
	    }
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": 230,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "variables_set_panda",
	  "message0": "set %1 to %2",
	  "args0": [
	    {
	      "type": "field_variable",
	      "name": "subject",
	      "variable": "item"
	    },
	    {
	      "type": "input_value",
	      "name": "subject",
	      "check": "Panda"
	    }
	  ],
	  "colour": 230,
	  "tooltip": "",
	  "helpUrl": ""
	},
	{
	  "type": "alternative_type",
	  "message0": "First of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 345,
	  "tooltip": "%{BKY_TOOLTIP_ALTERNATIVE}",
	  "helpUrl": "%{BKY_HELPURL_ALTERNATIVE}"
	},
	{
	  "type": "punct_type",
	  "message0": "punct",
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 230,
	  "tooltip": "%{BKY_TOOLTIP_PUNCT}",
	  "helpUrl": "%{BKY_HELPURL_PUNCT}"
	},
	{
	  "type": "plus_type",
	  "message0": "One or more of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_LAZY}",
	  "helpUrl": "%{BKY_HELPURL_PLUS}"
	},
	{
		  "type": "lazy_type",
		  "message0": "Lazily %1",
		  "args0": [
		    {
		      "type": "input_statement",
		      "name": "subject",
		      "check": "parser"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		  "colour": 180,
		  "tooltip": "%{BKY_TOOLTIP_LAZY}",
		  "helpUrl": "%{BKY_HELPURL_LAZY}"
		},
	{
	  "type": "kleene_type",
	  "message0": "Zero or more of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_KLEENE}",
	  "helpUrl": "%{BKY_HELPURL_KLEENE}"
	},
	{
	  "type": "expect_type",
	  "message0": "Abort, if not %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_EXPECT}",
	  "helpUrl": "%{BKY_HELPURL_EXPECT}"
	},
	{
	  "type": "char_value_type",
	  "message0": "single char %1",
	  "args0": [
	    {
	      "type": "field_input",
	      "name": "charValAtt",
	      "text": "a"
	    }
	  ],
	  "output": "char",
	  "colour": 75,
	  "tooltip": "%{BKY_TOOLTIP_CHAR_VALUE}",
	  "helpUrl": "%{BKY_HELPURL_CHAR_VALUE}"
	},
	{
	  "type": "expect_type",
	  "message0": "Abort parsing %1 if %2 fails",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "lhs",
	      "check": "parser"
	    },
	    {
	      "type": "input_statement",
	      "name": "rhs",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_EXPECT}",
	  "helpUrl": "%{BKY_HELPURL_EXPECT}"
	},
	{
	  "type": "sequence_type",
	  "message0": "Sequence of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 345,
	  "tooltip": "%{BKY_TOOLTIP_SEQUENCE}",
	  "helpUrl": "%{BKY_HELPURL_SEQUENCE}"
	},
	{
	  "type": "permutation_type",
	  "message0": "Permutation of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 345,
	  "tooltip": "%{BKY_TOOLTIP_PERMUTATION}",
	  "helpUrl": "%{BKY_HELPURL_PERMUTATION}"
	},
	{
	  "type": "sequential_or_type",
	  "message0": "Sequential Or of %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 345,
	  "tooltip": "%{BKY_TOOLTIP_SEQUENTIAL_OR}",
	  "helpUrl": "%{BKY_HELPURL_SEQUENTIAL_OR}"
	},
	{
		"type" : "repeat_type",
		"message0" : "repeat_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_REPEAT}",
		"helpUrl" : "%{BKY_HELPURL_REPEAT}"
	},
	{
	  "type": "difference_type",
	  "message0": "Accept %1 ... but not %2",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "lhs",
	      "check": "parser"
	    },
	    {
	      "type": "input_statement",
	      "name": "rhs",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 15,
	  "tooltip": "%{BKY_TOOLTIP_DIFFERENCE}",
	  "helpUrl": "%{BKY_HELPURL_DIFFERENCE}"
	},
	{
	  "type": "list_type",
	  "message0": "List of %1 ... separated by %2",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "lhs",
	      "check": "parser"
	    },
	    {
	      "type": "input_statement",
	      "name": "rhs",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 15,
	  "tooltip": "%{BKY_TOOLTIP_LIST}",
	  "helpUrl": "%{BKY_HELPURL_LIST}"
	},
	{
	  "type": "optional_type",
	  "message0": "Optionally ... %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_OPTIONAL}",
	  "helpUrl": "%{BKY_HELPURL_OPTIONAL}"
	},
	{
	  "type": "not_type",
	  "message0": "Not %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_NOT}",
	  "helpUrl": "%{BKY_HELPURL_NOT}"
	},
	{
	  "type": "and_type",
	  "message0": "And Predicate %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 180,
	  "tooltip": "%{BKY_TOOLTIP_AND}",
	  "helpUrl": "%{BKY_HELPURL_AND}"
	},
	{
	  "type": "as_string_type",
	  "message0": "As string %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_AS_STRING}",
	  "helpUrl": "%{BKY_HELPURL_AS_STRING}"
	},
	{
	  "type": "skip_type",
	  "message0": "Enable skipper %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_SKIP}",
	  "helpUrl": "%{BKY_HELPURL_SKIP}"
	},
	{
	  "type": "raw_type",
	  "message0": "Get raw input %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_RAW}",
	  "helpUrl": "%{BKY_HELPURL_RAW}"
	},
	{
	  "type": "omit_type",
	  "message0": "Omit ( %1 )",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_OMIT}",
	  "helpUrl": "%{BKY_HELPURL_OMIT}"
	},
	{
	  "type": "no_skip_type",
	  "message0": "Disable skipper %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_NO_SKIP}",
	  "helpUrl": "%{BKY_HELPURL_NO_SKIP}"
	},
	{
	  "type": "no_case_type",
	  "message0": "Ignore case on %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_NO_CASE}",
	  "helpUrl": "%{BKY_HELPURL_NO_CASE}"
	},
	{
	  "type": "matches_type",
	  "message0": "True, if %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_MATCHES}",
	  "helpUrl": "%{BKY_HELPURL_MATCHES}"
	},
	{
	  "type": "lexeme_type",
	  "message0": "Without skipping  %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_LEXEME}",
	  "helpUrl": "%{BKY_HELPURL_LEXEME}"
	},
	{
	  "type": "hold_type",
	  "message0": "Hold attribute while %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_HOLD}",
	  "helpUrl": "%{BKY_HELPURL_HOLD}"
	},
	{
	  "type": "expect_d_type",
	  "message0": "Abort, if not %1",
	  "args0": [
	    {
	      "type": "input_statement",
	      "name": "subject",
	      "check": "parser"
	    }
	  ],
	  "previousStatement": "parser",
	  "nextStatement": "parser",
	  "colour": 300,
	  "tooltip": "%{BKY_TOOLTIP_EXPECT_D}",
	  "helpUrl": "%{BKY_HELPURL_EXPECT_D}"
	},
	{
		"type" : "attr_type",
		"message0" : "attr_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_ATTR}",
		"helpUrl" : "%{BKY_HELPURL_ATTR}"
	},
	{
		"type" : "lazy_type",
		"message0" : "lazy_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LAZY}",
		"helpUrl" : "%{BKY_HELPURL_LAZY}"
	}, {
		"type" : "lit_type",
		"message0" : "lit_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LIT}",
		"helpUrl" : "%{BKY_HELPURL_LIT}"
	}, {
		"type" : "ruleref_type",
		"message0" : "ruleref_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_RULEREF}",
		"helpUrl" : "%{BKY_HELPURL_RULEREF}"
	}, {
		"type" : "byte_type",
		"message0" : "byte_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BYTE}",
		"helpUrl" : "%{BKY_HELPURL_BYTE}"
	}, {
		"type" : "big_word_type",
		"message0" : "big_word_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIG_WORD}",
		"helpUrl" : "%{BKY_HELPURL_BIG_WORD}"
	}, {
		"type" : "big_dword_type",
		"message0" : "big_dword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIG_DWORD}",
		"helpUrl" : "%{BKY_HELPURL_BIG_DWORD}"
	}, {
		"type" : "big_qword_type",
		"message0" : "big_qword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIG_QWORD}",
		"helpUrl" : "%{BKY_HELPURL_BIG_QWORD}"
	}, {
		"type" : "little_word_type",
		"message0" : "little_word_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LITTLE_WORD}",
		"helpUrl" : "%{BKY_HELPURL_LITTLE_WORD}"
	}, {
		"type" : "little_dword_type",
		"message0" : "little_dword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LITTLE_DWORD}",
		"helpUrl" : "%{BKY_HELPURL_LITTLE_DWORD}"
	}, {
		"type" : "little_qword_type",
		"message0" : "little_qword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LITTLE_QWORD}",
		"helpUrl" : "%{BKY_HELPURL_LITTLE_QWORD}"
	}, {
		"type" : "dword_type",
		"message0" : "dword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_DWORD}",
		"helpUrl" : "%{BKY_HELPURL_DWORD}"
	}, {
		"type" : "qword_type",
		"message0" : "qword_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_QWORD}",
		"helpUrl" : "%{BKY_HELPURL_QWORD}"
	}, {
		"type" : "word_type",
		"message0" : "word_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_WORD}",
		"helpUrl" : "%{BKY_HELPURL_WORD}"
	}, {
		"type" : "big_bin_double_type",
		"message0" : "big_bin_double_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIG_BIN_DOUBLE}",
		"helpUrl" : "%{BKY_HELPURL_BIG_BIN_DOUBLE}"
	}, {
		"type" : "big_bin_float_type",
		"message0" : "big_bin_float_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIG_BIN_FLOAT}",
		"helpUrl" : "%{BKY_HELPURL_BIG_BIN_FLOAT}"
	}, {
		"type" : "little_bin_double_type",
		"message0" : "little_bin_double_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LITTLE_BIN_DOUBLE}",
		"helpUrl" : "%{BKY_HELPURL_LITTLE_BIN_DOUBLE}"
	}, {
		"type" : "little_bin_float_type",
		"message0" : "little_bin_float_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LITTLE_BIN_FLOAT}",
		"helpUrl" : "%{BKY_HELPURL_LITTLE_BIN_FLOAT}"
	}, {
		"type" : "bin_double_type",
		"message0" : "bin_double_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIN_DOUBLE}",
		"helpUrl" : "%{BKY_HELPURL_BIN_DOUBLE}"
	}, {
		"type" : "bin_float_type",
		"message0" : "bin_float_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIN_FLOAT}",
		"helpUrl" : "%{BKY_HELPURL_BIN_FLOAT}"
	}, {
		"type" : "char_range_type",
		"message0" : "char_range_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_CHAR_RANGE}",
		"helpUrl" : "%{BKY_HELPURL_CHAR_RANGE}"
	}, {
		"type" : "char_set_type",
		"message0" : "char_set_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_CHAR_SET}",
		"helpUrl" : "%{BKY_HELPURL_CHAR_SET}"
	}, {
		"type" : "char_class_type",
		"message0" : "char_class_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_CHAR_CLASS}",
		"helpUrl" : "%{BKY_HELPURL_CHAR_CLASS}"
	}, {
		"type" : "char_type",
		"message0" : "char_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_CHAR}",
		"helpUrl" : "%{BKY_HELPURL_CHAR}"
	}, {
		"type" : "rule_type",
		"message0" : "rule_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_RULE}",
		"helpUrl" : "%{BKY_HELPURL_RULE}"
	}, {
		"type" : "grammar_type",
		"message0" : "grammar_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_GRAMMAR}",
		"helpUrl" : "%{BKY_HELPURL_GRAMMAR}"
	}, {
		"type" : "bin_type",
		"message0" : "bin_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BIN}",
		"helpUrl" : "%{BKY_HELPURL_BIN}"
	}, {
		"type" : "bool_type",
		"message0" : "bool_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_BOOL}",
		"helpUrl" : "%{BKY_HELPURL_BOOL}"
	},
	{
		"type" : "hex_type",
		"message0" : "hex_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_HEX}",
		"helpUrl" : "%{BKY_HELPURL_HEX}"
	}, {
		"type" : "oct_type",
		"message0" : "oct_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_OCT}",
		"helpUrl" : "%{BKY_HELPURL_OCT}"
	}, {
		"type" : "ushort_type",
		"message0" : "unsigned short: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		  "colour" : 230,
		  "tooltip" : "%{BKY_TOOLTIP_USHORT}",
		  "helpUrl" : "%{BKY_HELPURL_USHORT}"
	}, {
		"type" : "uint_type",
		"message0" : "unsigned integer: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		  "colour" : 230,
		  "tooltip" : "%{BKY_TOOLTIP_UINT}",
		  "helpUrl" : "%{BKY_HELPURL_UINT}"
	}, {
		"type" : "ulong_long_type",
		"message0" : "unsigned long long: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_ULONG_LONG}",
		"helpUrl" : "%{BKY_HELPURL_ULONG_LONG}"
	}, {
		"type" : "ulong_type",
		"message0" : "unsigned long: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_ULONG}",
		"helpUrl" : "%{BKY_HELPURL_ULONG}"
	}, {
		"type" : "short_type",
		"message0" : "short: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_SHORT}",
		"helpUrl" : "%{BKY_HELPURL_SHORT}"
	},
	{
		  "type": "int_type",
		  "message0": "integer: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		  "colour": 230,
		  "tooltip" : "%{BKY_TOOLTIP_INT}",
		  "helpUrl" : "%{BKY_HELPURL_INT}"
		},
		{
		"type" : "long_long_type",
		"message0" : "long_long: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LONG_LONG}",
		"helpUrl" : "%{BKY_HELPURL_LONG_LONG}"
	}, {
		"type" : "long_type",
		"message0" : "long: %1",
		  "args0": [
		    {
		      "type": "input_value",
		      "name": "config",
		      "check": "integer"
		    }
		  ],
		  "previousStatement": "parser",
		  "nextStatement": "parser",
		  "colour" : 230,
		  "tooltip" : "%{BKY_TOOLTIP_LONG}",
		  "helpUrl" : "%{BKY_HELPURL_LONG}"
	}, {
		"type" : "float_type",
		"message0" : "float_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_FLOAT}",
		"helpUrl" : "%{BKY_HELPURL_FLOAT}"
	}, {
		"type" : "long_double_type",
		"message0" : "long_double_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_LONG_DOUBLE}",
		"helpUrl" : "%{BKY_HELPURL_LONG_DOUBLE}"
	}, {
		"type" : "double_type",
		"message0" : "double_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_DOUBLE}",
		"helpUrl" : "%{BKY_HELPURL_DOUBLE}"
	}, {
		"type" : "string_type",
		"message0" : "string_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_STRING}",
		"helpUrl" : "%{BKY_HELPURL_STRING}"
	}, {
		"type" : "symbols_type",
		"message0" : "symbols_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_SYMBOLS}",
		"helpUrl" : "%{BKY_HELPURL_SYMBOLS}"
	}, {
		"type" : "advance_type",
		"message0" : "advance_type",
		"colour" : 230,
		"tooltip" : "%{BKY_TOOLTIP_ADVANCE}",
		"helpUrl" : "%{BKY_HELPURL_ADVANCE}"
	}
  ]);
