/***********************************************************************
 * styleSheetFactory Factory
 * Author: Brenton Klik
 * 
 * Prerequisites: AngularJS
 * 
 * Example Use:
 * angular.module('sampleApp', []).factory('styleSheetFactory', func…
 * .directive('example', ['styleSheetFactory', function(styleSheetFactory)…
 * 
 * Description:
 * This factory provides a series of methods to make management of CSS
 * styles in javascript easier. Directives may take advantage of these
 * to include thier CSS as part of their code, rather than an external
 * style sheet.
/**********************************************************************/
angular.module('styleSheetFactory', [])

.factory('styleSheetFactory', function(){
    return {
        // Finds and returns the browsers's main style sheet.
        getStyleSheet: function() {
            for(var i=0; i<document.styleSheets.length; i++) {
                if(
                    document.styleSheets[i].media.mediaText == '' ||
                    document.styleSheets[i].media.mediaText == 'all' ||
                    document.styleSheets[i].media.mediaText == 'screen'
                ) {
                    return document.styleSheets[i];
                }
            }
    
            return null;
        },
    
        // Gets the prefix related to the user's browser type. Used in
        // CSS for non-standardized properties.
        getPrefix: function() {
            var prefixes = ['Webkit', 'Moz', 'ms', 'O', 'Khtml'];
            for(var i=0; i<prefixes.length; i++) {
                if(document.body.style[ prefixes[i] + 'AnimationName' ] !== undefined) {
                    return prefixes[i].toLowerCase();
                }
            }
            return '';
        },
    
        // Returns whether a rule of that selector exists in the stylesheet.
        hasCSSRule: function(sheet, selector) {
            var rules = sheet.rules || sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    return true;
                }
            }
    
            return false;
        },
    
        // If no selector of that rule exists, adds the new rule to the stylesheet.
        addCSSRule: function(sheet, selector, rules, index) {
            if(!this.hasCSSRule(sheet, selector)) {
                if(typeof sheet.insertRule === 'function') {
                    sheet.insertRule(selector + "{" + rules + "}", index);
                }
                else if(typeof sheet.addRule === 'function') {
                    sheet.addRule(selector, rules, index);
                }
            }
        },
    
        // Removes a rule of the existing selector from the stylesheet.
        removeCSSRule: function(sheet, selector) {
            var rules = sheet.rules || sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    sheet.deleteRule(i);
                    sheet.removeRule(i);
                    break;
                }
            }
        },
    
        // Adds a keyframes animation to the stylesheet with te appropriate prefixing.
        addCSSKeyframes: function(sheet, name, rules, index) {
            if(this.getPrefix() != '') {
                this.addCSSRule(sheet, '@-'+this.getPrefix()+'-keyframes '+name, rules, index);
            } else {
                this.addCSSRule(sheet, '@keyframes '+name, rules, index);
            }
        }
    }
});
