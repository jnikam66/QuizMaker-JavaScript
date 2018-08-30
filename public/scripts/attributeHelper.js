

/*

AttributeHelper(oDebug)
AttributeHelper::ParseAttributes(attributes_string)
AttributeHelper::ParseAttributeModifiers(modifiers)
AttributeHelper::ApplyAttributeModifiers(attributes, modifiers)
AttributeHelper::ComputeCharacterAttributeDistance(attributes1, attributes2)

*/

//
(function(){

  //  Per our convention, make sure App exists in window
  if ( !window.App ) {
    window.App = {};
  }

  //  Import globals
  var $ = window.$;

  //  AttributeHelper(oDebug)
  var AttributeHelper = function AttributeHelper(oDebug) {

    //
    this.debug = oDebug;

    //  Regular expressions
    this.regularExpressions = {};
    this.regularExpressions.ATTRIBUTE_MODIFIER = /^([a-z_-]+)=((\+|-)?[0-9]+)$/i;

    //  Form patterns
    this.formFieldPatterns = {};
    this.formFieldPatterns.ATTRIBUTE_MODIFIERS = "^(([a-z_-]+)=((\\+|-)?[0-9]+);)+";
  };

  //  AttributeHelper::ParseAttributes(attributes_string)
  AttributeHelper.prototype.ParseAttributes = function ParseAttributes(attributes_string) {

    //
    var oThis = this;
    var attributes = {};

    //  Split by semicolon
    var attributes_split = $.trim(attributes_string).split(";");

    //  Parse each
    $.each(attributes_split, function(index, attribute){

      //
      attribute = $.trim(attribute);
      if (attribute != "") {

        //
        var matched = attribute.match( oThis.regularExpressions.ATTRIBUTE_MODIFIER );
        if ( !matched ) {
          throw "ParseAttributes() - Error parsing \"" + attribute + "\" in string \"" + attributes_string + "\"";
        }

        //  Assign to dictionary
        attributes[matched[1]] = parseInt(matched[2]);
      }
    });

    return attributes;
  };

  //  AttributeHelper::ParseAttributeModifiers(modifiers)
  AttributeHelper.prototype.ParseAttributeModifiers = function ParseAttributeModifiers(modifiers) {

    //
    var oThis = this;
    var modifiers_parsed = {};

    //  Split by semicolon
    var modifiers_split = $.trim(modifiers).split(";");

    //  Iterate through each part
    $.each(modifiers_split, function(index, modifier_string){

      //
      modifier_string = $.trim(modifier_string);
      if (modifier_string != "") {

        //  Be nicer to user error by removing the equal sign, if found
        modifier_string = modifier_string.replace("=", "");

        //  Split key from integer value
        var matched = modifier_string.match(/^([a-z_]+)((\+|-)?[0-9]+)$/i);
        if ( !matched ) {
          oThis.debug.DoError("Error parsing attribute modifiers: " + modifiers);
          return false;
        }

        //  Assign values
        var key = matched[1];
        var value = parseInt(matched[2]);
        modifiers_parsed[key] = value;
      }
    });

    return modifiers_parsed;
  };

  //  AttributeHelper::ApplyAttributeModifiers(attributes, modifiers)
  AttributeHelper.prototype.ApplyAttributeModifiers = function ApplyAttributeModifiers(attributes, modifiers) {

    //
    var oThis = this;

    //
    if (attributes == null || attributes == undefined) {
      attributes = {};
    }

    //
    if ( typeof(modifiers) == "string" ) {
      modifiers = oThis.ParseAttributeModifiers(modifiers);
    }

    //
    $.each(modifiers, function(key, value){

      //
      if ( !attributes[key] ) {
        attributes[key] = 0;
      }
      attributes[key] += parseInt(value);
    });

    return attributes;
  };

  //  AttributeHelper::ComputeCharacterAttributeDistance(attributes1, attributes2)
  AttributeHelper.prototype.ComputeCharacterAttributeDistance = function ComputeCharacterAttributeDistance(attributes1, attributes2) {

    //
    var distance = 0;

    //
    if ( !attributes1 ) {
      throw "AttributeHelper::ComputeCharacterAttributeDistance() - attributes1 is invalid";
    }
    if ( !attributes2 ) {
      throw "AttributeHelper::ComputeCharacterAttributeDistance() - attributes1 is invalid";
    }

    //  Gather only keys present in both; Keys not in both are not considered
    var keys = {};
    $.each(attributes1, function(key){
      if (attributes2[key] != undefined ) {
        keys[key] = key;
      }
    });

    //  Compare all keys which are present in both
    $.each(keys, function(index, key){

      //
      var value1 = 0;
      var value2 = 0;

      //
      if ( attributes1[key] ) {
        value1 = attributes1[key];
      }
      if ( attributes2[key] ) {
        value2 = attributes2[key];
      }

      //
      distance += Math.abs(value1 - value2);
    });

    return distance;
  };

  //  Add module class to App
  window.App.AttributeHelper = AttributeHelper;

})();
