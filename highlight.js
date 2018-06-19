'use strict';

var Highlight = (function (highlight, undefined) { 

  var RESULT_CSS = [];
  RESULT_CSS['accept'] = "highlightAccept";
  RESULT_CSS['try'] = "highlightTry";
  RESULT_CSS['reject'] = "highlightReject";
  var resultIndexCorrection = 0;

  highlight.set = function (cStep) {
    var indexFrom = resultIndexCorrection + cStep.from;
    var indexTo = resultIndexCorrection + cStep.to;

    var inputValue = inputText.innerHTML;
    if (indexTo >= 0 && indexTo > indexFrom) {
      var newValue = inputValue.substring(0, indexFrom)  + "<span class='" + RESULT_CSS[cStep.action]  + "'>" + inputValue.substring(indexFrom, indexTo)  + "</span>" + inputValue.substring(indexTo, inputValue.length);
      inputText.innerHTML = newValue;
      resultIndexCorrection += (newValue.length - inputValue.length);
    }
  }

  // this one currently is not generic enough
  highlight.remove = function (indexFrom = null) {
    if (!indexFrom) {
      // remove all <span ...> </span> tags
      inputText.innerHTML = inputText.innerHTML.replace(/<span.*>(.*)<\/span>/g, '$1');
      resultIndexCorrection = 0;
      return;
    }
    // remove a particular <span ...> </span> tag
    var inputValue = inputText.innerHTML;
    var indexStart1 = inputValue.indexOf("<span", indexFrom);
    var indexEnd = inputValue.indexOf(">", indexFrom);
    var indexStart2 = inputValue.indexOf("</span>", indexFrom);

    if (indexStart1 == indexFrom) {
      var s1 = inputValue.substring(0, indexStart1);
      var s2 = inputValue.substring(indexEnd + 1, indexStart2);
      var s3 = inputValue.substring(indexStart2 + 7, inputValue.length);
      var newValue = s1 + s2 + s3;
      inputText.innerHTML = newValue;

      resultIndexCorrection += newValue.length - inputValue.length;
    }
  }

  return highlight;
})(Highlight || {});
