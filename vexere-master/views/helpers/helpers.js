var register = function (Handlebars) {
  var helpers = {
    // put all of your helpers inside this object
    switch: function (value, options) {
      this._switch_value_ = value;
      var html = options.fn(this); // Process the body of the switch block
      delete this._switch_value_;
      return html;
    },
    case: function (value, options) {
      if (value == this._switch_value_) {
        return options.fn(this);
      }
    }
  };
  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers;
  }
}
var helpers = register(null);
export {register};
export {helpers}  