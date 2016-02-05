/***********************************************************************
Style Sheet Factory
Author: Brenton Klik

Prerequisites: AngularJS

Description:
This factory provides a series of methods to make management of CSS
styles in javascript easier. Directives may take advantage of these
to include thier CSS as part of their code, rather than an external
style sheet.
/**********************************************************************/
angular.module('style-sheet-factory', [])

.factory('styleSheetFactory', ['$log', function($log){
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
                    return '-'+prefixes[i].toLowerCase()+'-';
                }
            }
            return '';
        },
    
        // Returns whether a rule of that selector exists in the stylesheet.
        hasCSSRule: function(sheet, selector) {
            var rules = sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    return true;
                }
            }
    
            return false;
        },
    
        // If no selector of that rule exists, adds the new rule to the stylesheet.
        addCSSRule: function(sheet, selector, rules, index) {
            index = index || 1;

            if(!this.hasCSSRule(sheet, selector)) {
                try {
                    sheet.insertRule(selector + "{" + rules + "}", index);

                    // Compare selectors
                    var newSelector = sheet.cssRules[index].cssText.split(' {')[0];

                    if(selector !== newSelector) {
                        $log.warn(
                            'The browser has changed the selector of the rule you added to the StyleSheet.' +
                            '\nOld: '+selector+
                            '\nNew: '+newSelector+
                            '\nThis may cause duplicate rules and harm browser performance. Replace your ' +
                            'selector with the new selector.'
                        );
                    }
                } catch(e) {
                    $log.error('Failed to add rule: ' + selector);
                }
            }
        },
    
        // Removes a rule of the existing selector from the stylesheet.
        removeCSSRule: function(sheet, selector) {
            var rules = sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    sheet.deleteRule(i);
                    break;
                }
            }
        },
    
        // Adds a keyframes animation to the stylesheet with te appropriate prefixing.
        addCSSKeyframes: function(sheet, name, rules, index) {
            //sheet.insertRule('@'+this.getPrefix()+'keyframes ' + name + "{" + rules + "}", index);
            this.addCSSRule(sheet, '@'+this.getPrefix()+'keyframes '+name, rules, index);
        }
    }
}]);
