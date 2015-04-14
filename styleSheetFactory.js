factory('$styleSheet', function(){
    return {
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
        getPrefix: function() {
            var prefixes = ['Webkit', 'Moz', 'ms', 'O', 'Khtml'];
            for(var i=0; i<prefixes.length; i++) {
                if(document.body.style[ prefixes[i] + 'AnimationName' ] !== undefined) {
                    return prefixes[i].toLowerCase();
                }
            }
            return '';
        },
        hasCSSRule: function(sheet, selector) {
            var rules = sheet.rules || sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    return true;
                }
            }

            return false;
        },
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
        removeCSSRule: function(sheet, selector) {
            var rules = sheet.rules || sheet.cssRules;
            for(var i=0; i<rules.length; i++) {
                if(rules[i].selectorText == selector) {
                    sheet.deleteRule(i);
                    break;
                }
            }
        },
        addCSSKeyframes: function(sheet, name, rules, index) {
            if(this.getPrefix() != '') {
                this.addCSSRule(sheet, '@-'+this.getPrefix()+'-keyframes '+name, rules, index);
            } else {
                this.addCSSRule(sheet, '@-keyframes '+name, rules, index);
            }
        }
    }
})
