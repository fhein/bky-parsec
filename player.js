'use strict';

var Player = (function (player, rpc, highlight, app, undefined) {
  var state = 'idle';

  var interval = 500;
  var animation = false;
  var resultStep = undefined;

  var response;
  var resultStep = undefined;
  var resultIndexCorrection = 0;

  var nextStep = function () {
    if (!resultStep) {
      resultStep = 0;
    } else {
      // remove highlighting of previous step
      var prevStep = response.result.actions[resultStep - 1];
      app.workspace.highlightBlock(prevStep.block, false);
      // highlight.remove(prevStep.from);
      highlight.remove();
    }

    if (resultStep < response.result.actions.length) {

      // do highlighting for current step
      var curStep = response.result.actions[resultStep];

      //highlight blocks
      app.workspace.highlightBlock(curStep.block, true);

      //highlight text
      highlight.set(curStep.from, curStep.to, curStep.action);

      // output
      if (curStep.output && curStep.output.length != 0) {
        outputText.value += curStep.output;
        if (curStep.action == 'accept') {
          outputText.value += ', attribute: ' + curStep.attribute;
        }
        outputText.value += '\n';
      }
      resultStep++;
      outputText.scrollTop = outputText.scrollHeight;
      return false;
    } else {
      displayParserResult(response)
      return true;
    }
  }

  player.prepareCode = function (code) {
    if (code.length == 0) {
      return;
    }
    var start;
    if (code[0] == '[') {
      start = 'parser';
      code = '"' + start + '":' + code;
    } else {
      start = code.substr(1, code.indexOf(':') - 2);
    }
    code = '{' + code + '}';
    return {
      "start": start,
      "parser": code.replace(/\,(?=\s*?[\}\]])/g, '')
    };
  };

  player.stop = function () {
    if (state == 'idle') return;
    if (animation) {
      window.clearInterval(animation);
      animation = false;
    }
    outputText.value += '\nParser stopped.\n';
    outputText.scrollTop = outputText.scrollHeight;

    var prevStep = response.result.actions[resultStep - 1];
    if (prevStep) {
      app.workspace.highlightBlock(prevStep.block, false);
    }
    highlight.remove();

    resultStep = undefined;
    state = 'idle';
    document.getElementById('playPauseIcon').classList.toggle("fa-fast-forward");
    document.getElementById('playPauseButton').title = MSG['playTooltip'];
    console.log(state);
  };

  var getArgs = function (block) {
    var code = block ? Blockly.PHP.blockToCode(block) : code = Blockly.PHP.workspaceToCode(app.workspace);

    if (block) {
      // blockToCode returns the code of the current block AND ALL blocks connected downstream
      // This is a nasty hack to get rid of the downstream block's code
      if (code[0] !== '"') {
        code = '[' + code + ']';
        code = code.replace(/\,(?=\s*?[\}\]])/g, '');
        code = JSON.parse(code);
        code = JSON.stringify(code[0]);
      }
    }

    var args = player.prepareCode(code);
    args.parser = JSON.parse(args.parser);
    args.input = inputText.innerHTML;
    var sel = window.getSelection();
    var range = sel.rangeCount ? sel.getRangeAt(0) : null;
    if (range) {
      args.selectionStart = range.startOffset;
      args.selectionEnd = range.endOffset > range.startOffset ? range.endOffset : inputText.innerText.length;
    } else {
      args.selectionStart = 0;
      args.selectionEnd = inputText.innerText.length;
    }
    sel.removeAllRanges();
    return args;
  };

  var animate = function(r) {
    response = r;
    outputText.value = 'Single Step Parser started.\n\n';
    outputText.scrollTop = outputText.scrollHeight;
    animation = window.setInterval(function() {if (nextStep()) player.stop(); }, interval);
  };

  var handleError = function (error) {
    outputText.value += error;
    outputText.scrollTop = outputText.scrollHeight;
  };

  var displayParserResult = function(response) {
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

  player.run = function (block = null) {
    if (state != 'idle') {
      player.stop();
    }
    highlight.remove();
    outputText.value = 'Parser started.\n';
    rpc.call('parse', getArgs(block))
      .then(displayParserResult)
      .catch(handleError);
    state = 'idle';
  };

  player.step = function(block = null) {
    switch (state) {
      case 'idle':
        state = 'running';
        rpc.call('trace', getArgs(block))
          .then(animate)
          .then(pause)
          .catch(handleError);
        break;

      case 'paused':
        if (nextStep()) player.stop();
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
    highlight.remove();
    state = 'running';
    const call = rpc.call('trace', getArgs(block));
    call
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
    document.getElementById('playPauseIcon').classList.toggle("fa-fast-forward");
    document.getElementById('playPauseButton').title = MSG['resumeTooltip'];
    console.log(state);
  };

  player.resume = function () {
    if (state != 'paused') return;
    animation = window.setInterval(function() {if (nextStep()) player.stop(); }, interval);
    state = 'running';
    document.getElementById('playPauseIcon').classList.toggle("fa-pause")
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