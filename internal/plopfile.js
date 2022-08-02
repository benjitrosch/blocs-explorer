const { buildGenerator } = require('./generators')

module.exports = function(plop) {
    plop.setGenerator("build",  buildGenerator)
    plop.setHelper("ifeq", function(a, b, options) {
        return (a == b) ? options.fn(this) : options.inverse(this)
    })
    plop.setHelper('ifneq', function (a, b, options) {
        return a != b ? options.fn(this) : options.inverse(this)
    });
}
