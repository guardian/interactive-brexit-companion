import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import thankYouHTML from './text/thankYou.html!text'

import questionAndAnswer from './text/questionAndAnswer.dot.html!text'
import expandableQuestionAndAnswer from './text/expandableQuestionAndAnswer.dot.html!text'

import dot from 'olado/doT'


var isVisible;
var visibilityEventName = 'interactiveVisibilityChange';
var visibilityEvent;
var ophanUrl = '//j.ophan.co.uk/interactive.js';

var formats = {
    flat: {
        preprocess: (data) => data,
        template: questionAndAnswer
    },
    expandable: {
        preprocess: (data) => {
            // TODO: don't modify data in place!
            let words = data.Answer.split(' ');
            data.mainAnswer = words.slice(0, 65).join(' ');
            data.extraAnswer = words.slice(65).join(' ');
            return data;
        },
        template: expandableQuestionAndAnswer
    },
    carousel: {
        preprocess: (data) => data,
        template: ''
    }
}

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

function q(selectorString) {
    return [].slice.apply(document.querySelectorAll(selectorString));
}

function bindEventHandlers() {
    q('.js-feedback').forEach(el => el.addEventListener('click', ev => {
        let el = ev.currentTarget;
        let feedback = el.parentNode;
        feedback.innerHTML = thankYouHTML.replace(/%surveyHref%/g, el.getAttribute('data-survey-href'));
    }));

    q('.js-expand').forEach(el => el.addEventListener('click', ev => {
        let link = ev.currentTarget;
        q('.js-extra-content').forEach(el => el.classList.remove('u-hidden'));
        link.remove();
    }));
}

function setupVisibilityMonitoring() {
    iframeMessenger.monitorPosition(data => {
        function _isVisible(threshold) {
            var threshold = threshold || 1;
            var width = data.iframeRight - data.iframeLeft;
            var height = data.iframeBottom - data.iframeTop;
            return (
                data.iframeLeft >= -(width * (1 - threshold)) &&
                data.iframeTop >= -(height * (1 - threshold)) &&
                data.iframeRight <= data.innerWidth + (width * (1 - threshold)) &&
                data.iframeBottom <= data.innerHeight + (height * (1 - threshold))
            );
        }

        function _hasVisibilityChanged() {
            var wasVisible = isVisible;
            isVisible = _isVisible(0.5);
            return (wasVisible !== isVisible);
        }

        if (_hasVisibilityChanged()) {
            document.dispatchEvent(visibilityEvent);
        }
    });    
}

function loadOphan() {
    visibilityEvent = document.createEvent('Event');
    visibilityEvent.initEvent(visibilityEventName, true, true);

    curl([ophanUrl]).then(function(ophan) {
        ophan.initAttention({
            changeEvent: visibilityEventName,
            state: function() {
                return isVisible ? 'visible' : 'invisible';
            }
        });
    });
}

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    loadOphan();
    setupVisibilityMonitoring();

    var query = window.location.search.replace('?', '').split('&');
    var params = {};
    query.forEach(q => {
        let keyVal = q.split('=');
        params[keyVal[0]] = keyVal[1];
    });

    var sheet = params.sheet;
    var id = params.id;

    var format = params.format || 'flat';
    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1zsqQf4mq8fsAkZAXnoSCNpap2hykFDA3Cm3HaI9qe8k.json',
        type: 'json',
        crossOrigin: false,
        success: (resp) => {
            var rows = resp && resp.sheets && resp.sheets[sheet];
            var row;

            if (rows && rows.length) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].id === id) {
                        row = rows[i];
                    }
                }

                if (!row) {
                    console.log('row with id ' + id + ' not found');
                    return;
                }

                let template = formats[format] && formats[format].template;

                if (!template) {
                    console.log('format ' + format + ' is not valid');
                    return;
                }

                let fn = dot.template(template);
                let trackingCode = 'brexit__' + sheet + '__' + row.id;
                el.innerHTML = fn({
                    data: formats[format].preprocess(row),
                    trackingCode: {
                        like: trackingCode + '__like',
                        dislike: trackingCode + '__dislike'
                    }
                });

                bindEventHandlers();
            } else {
                console.log('bad JSON response');
                console.log(resp);
            }
        }
    });
};

