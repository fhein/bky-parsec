String.prototype.toUnderScore = function() {
    return this.replace(/\.?([A-Z]+)/g, function (x,y){return '_' + y.toLowerCase()}).replace(/^_/, '');
}

String.prototype.toCamelCase = function() {
    return this.replace(/_+/g,' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/[\s]+/g, '');
}
