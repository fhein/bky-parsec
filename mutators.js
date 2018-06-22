var Mutators = (function(Mutators, player, undefined) {

  var mutators = {
    'breakpoint_mutator': {
      mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('breakpoint', this.breakpoint)
        return container;
      },
      domToMutation: function(xmlElement) {
        this.stdColor = this.getColour();
        player.setBreakpoint(this, xmlElement.getAttribute('breakpoint') == "true");
      }
    }
  };

  Mutators.init = function(mutatorList) {
    for (mutator of mutatorList) {
      if (typeof mutators[mutator] !== 'object') {
        console.log('Mutator ' + mutator + ' not implemented yet. Stub inserted.');
        var that = {};
        that.mutator = mutator;
        var code = {
          mutator: mutator,
          mutationToDom: function() {
            return document.createElement(mutator);
            console.log('Stub mutationToDom for mutator ' + that.mutator + ' which is not implemented yet.');
          },
          domToMutation: function(xmlElement) {
            console.log('Stub domToMutation for mutator ' + that.mutator + ' which is not implemented yet.');
          }          
        };
      } else {
        var code = mutators[mutator];
      }
      Blockly.Extensions.registerMutator(mutator, code);
    }
  };

  return Mutators;
})(Mutators || {}, Player);

console.log('Public interface of Mutators:', Mutators);