'use strict';

var Player = (function (player, rpc, textHighlight, app, undefined) {
  var state = 'idle';

  var interval = 500;
  var animation = false;
  var response = undefined;
  var cStepIdx = undefined;
  var references = [];
  var highlights = [];

  var setupResponse = function(res) {
    response = res;
  }

  var adjustHighlights = function(cStep) {
    var pStep = highlights.pop();
    if (pStep) {
      // remove highlighting of previous step
      var prevBlock = pStep.block != 'auto_sequence' ? app.workspace.getBlockById(pStep.block) : null;
      var curBlock = cStep && cStep.block != 'auto_sequence' ? app.workspace.getBlockById(cStep.block) : null;
      
      if (!cStep || (prevBlock && prevBlock.type != 'reference_type') || (curBlock && curBlock.type != 'rule_type')) {
        app.workspace.highlightBlock(pStep.block, false);
      }
      if (prevBlock && prevBlock.type == 'reference_type') {
          references.push(pStep.block);
      }
      // textHighlight.remove(pStep.from);
      textHighlight.remove();
    }
    
    if (cStepIdx == response.result.actions.length) return true;

    textHighlight.set(cStep);
    //highlight blocks
    if (cStep.block != 'auto_sequence')
      app.workspace.highlightBlock(cStep.block, true);

    // output
    if (cStep.output && cStep.output.length != 0) {
      outputText.value += cStep.output;
      if (cStep.action == 'accept') {
        outputText.value += ', attribute: ' + cStep.attribute;
      }
      outputText.value += '\n';
    }
    highlights.push(cStep);    
    cStepIdx++;
    outputText.scrollTop = outputText.scrollHeight;
    return false;
  }

  var nextBreakpoint = function() {
    if (!cStepIdx) cStepIdx = 0;
    
    var last = response.result.actions.length;

    while (cStepIdx < last) {
      var cStep = response.result.actions[cStepIdx++];
      if (cStep.block !== 'auto_sequence' && app.workspace.getBlockById(cStep.block).breakpoint) {
        break;
      }
    }
    return adjustHighlights(cStep);
  }

  var nextStep = function () {
    if (!cStepIdx) cStepIdx = 0;
    
    var last = response.result.actions.length;
    var cStep = cStepIdx <  last ? response.result.actions[cStepIdx] : null;

    return adjustHighlights(cStep);
  }

  player.stop = function () {
    if (state == 'idle') return;
    if (animation) {
      window.clearInterval(animation);
      animation = false;
    }
    outputText.value += '\nParser stopped.\n';
    outputText.scrollTop = outputText.scrollHeight;
    var pStep = highlights.pop();
    if (pStep) {
      app.workspace.highlightBlock(pStep.block, false);
    }
    for (var reference of references) {
      app.workspace.highlightBlock(reference, false);
    }
    textHighlight.remove();

    references = [];
    cStepIdx = undefined;
    state = 'idle';
    document.getElementById('playPauseIcon').classList.toggle("fa-play");
    document.getElementById('playPauseButton').title = MSG['playTooltip'];
    console.log(state);
  };

  player.prepareCode = function(code, block = null) {
    if (code.length == 0) {
      return;
    }
    code = '[' + code + ']';
    code = code.replace(/\,(?=\s*?[\}\]])/g, '');
    let start;
    if (!block) {
      // if no start block is given take the first block
      // defined in code
      let objects = JSON.parse(code);
      // objects[0] -> first block in code
      // objects[0][1] -> parameter array of first block
      // objects[0][1][0] -> first parameter (block id)
      start = objects[0][1][0];
    } else {
      start = block.id;
    }
    return {
      start: start,
      parser: code
    };
  };

  var getArgs = function (block) {
    var code = Blockly.PHP.workspaceToCode(app.workspace);
    var args = player.prepareCode(code, block);
    args.parser = JSON.parse(args.parser);
    args.input = inputText.innerHTML;
    var sel = window.getSelection();
    var range = sel.rangeCount ? sel.getRangeAt(0) : null;
    args.selectionStart = 0;
    args.selectionEnd = inputText.innerText.length;
    // apply user's selection only if length > 0
    if (range && (range.startOffset != range.endOffset)) {
      args.selectionStart = range.startOffset;
      args.selectionEnd = range.endOffset;
    }
    sel.removeAllRanges();
    return args;
  };

  var runToBreakpoint = function() {
    outputText.value = 'Parser Debugger started.\n\n';
    outputText.scrollTop = outputText.scrollHeight;
    if (nextBreakpoint()) {
      displayParserResult();
      player.stop();
    }
  }

  var animate = function() {
    outputText.value = 'Parser Debugger started.\n\n';
    outputText.scrollTop = outputText.scrollHeight;
    animation = window.setInterval(
      function() {
        if (nextStep()) {
          displayParserResult();
          player.stop(); 
        }
      }, interval)
  };

  var handleError = function (error) {
    outputText.value += error;
    outputText.scrollTop = outputText.scrollHeight;
  };

  player.setBreakpoint = function(block, value) {
    if (value == true) {
      block.breakpoint = true;
      block.stdColour = block.getColour();
      block.setColour(0);
    } else {
      block.breakpoint = false;
      block.setColour(block.stdColor);
    }
  }

  player.toggleBreakpoint = function(block) {
    player.setBreakpoint(block, !block.breakpoint);
  }

  var displayParserResult = function() {
    var success = response.result.result;
    var output = success ? '\nParser succeeded. ' : 'Parser failed. ';
    outputText.value += output;
    var bytesLeft = response.result.bytesLeft;
    var m = ' byte';
    if (bytesLeft > 1) m += 's';
    outputText.value += (bytesLeft > 0) ? bytesLeft + m + ' of input left.\n' : 'All input consumed.\n';
    if (success == true) {
      outputText.value += '\nAttribute:\n';
      outputText.value += JSON.stringify(response.result.attribute, 0, 2) + '\n';
    }
    outputText.scrollTop = outputText.scrollHeight;
  };

  player.debug = function(block = null) {
    switch (state) {
      case 'idle':
        state = 'running';
        rpc.call('trace', getArgs(block))
          .then(setupResponse)
          .then(runToBreakpoint)
          .then(pause)
          .catch(handleError);
        break;

      case 'paused':
        if (nextBreakpoint()) {
          displayParserResult();
          player.stop();
        }
        break;

      case 'running':
        pause();
        break;
    }
  };

  player.run = function (block = null) {
    if (state != 'idle') {
      player.stop();
    }
    textHighlight.remove();
    outputText.value = 'Parser started.\n';
    rpc.call('parse', getArgs(block))
      .then(setupResponse)
      .then(displayParserResult)
      .catch(handleError);
    state = 'idle';
  };

  player.step = function(block = null) {
    switch (state) {
      case 'idle':
        state = 'running';
        rpc.call('trace', getArgs(block))
          .then(setupResponse)
          .then(animate)
          .then(pause)
          .catch(handleError);
        break;

      case 'paused':
        if (nextStep()) {
          displayParserResult();
          player.stop();
        }
        break;

      case 'running':
        pause();
        break;
    }
  };

  var play = function (block = null) {
    if (state != 'idle') {
      player.stop();
    }
    textHighlight.remove();
    state = 'running';
    const call = rpc.call('trace', getArgs(block));
    call
      .then(setupResponse)
      .then(animate)
      .then(function(r) {
        document.getElementById('playPauseIcon').classList.toggle("fa-pause");
        document.getElementById('playPauseButton').title = MSG['pauseTooltip'];
      })
      .catch(handleError);
  };

  var pause = function () {
    if (state != 'running') return;
    window.clearInterval(animation);
    state = 'paused';
    document.getElementById('playPauseIcon').classList.toggle("fa-play");
    document.getElementById('playPauseButton').title = MSG['resumeTooltip'];
    console.log(state);
  };

  player.resume = function () {
    if (state != 'paused') return;
    animation = window.setInterval(
      function() {
        if (nextStep()) 
          player.stop(); 
      }, 
      interval
    );
    state = 'running';
    document.getElementById('playPauseIcon').classList.toggle("fa-pause")
    document.getElementById('playPauseButton').title = MSG['pauseTooltip'];
    console.log(state);
  };

  player.playPause = function (block = null) {
    if (state == 'idle') {
      play(block);
    } else if (state == 'running') {
      pause();
    } else if (state == 'paused') {
      Player.resume();
    }
  };
  return player;
})(Player || {}, JsonRpcClient, Highlight, mxcParsec);

console.log('Public interface of Player: ', Player);