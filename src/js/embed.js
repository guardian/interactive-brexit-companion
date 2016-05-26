import iframeMessenger from 'guardian/iframe-messenger';
import dot from 'olado/doT';
import formats from './formats/index';
import feedback from './text/feedback.dot.partial.html!text';
import render from './render';
import requests from './requests';
import parallel from 'async.parallel';

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function remove() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

let visible;

function setupVisibilityMonitoring() {
    iframeMessenger.monitorPosition(data => {
        function isVisible(threshold = 1) {
            const width = data.iframeRight - data.iframeLeft;
            const height = data.iframeBottom - data.iframeTop;

            return (
                data.iframeLeft >= -(width * (1 - threshold)) &&
                data.iframeTop >= -(height * (1 - threshold)) &&
                data.iframeRight <= data.innerWidth + (width * (1 - threshold)) &&
                data.iframeBottom <= data.innerHeight + (height * (1 - threshold))
            );
        }

        function hasVisibilityChanged() {
            const wasVisible = visible;

            visible = isVisible(0.5);

            return (wasVisible !== visible);
        }

        if (hasVisibilityChanged()) {
            if (visible) {
                // TODO: track visibility change
            } else {
                // TODO: track visibility change
            }
        }
    });
}

function getQueryParams() {
    const query = window.location.search.replace('?', '').split('&');
    const params = {};

    query.forEach(q => {
        const keyVal = q.split('=');
        params[keyVal[0]] = keyVal[1];
    });

    return params;
}

window.init = function init(parentEl) {
    const untailoredRequest = callback => callback(null, {});
    const params = getQueryParams();
    const isTailored = Boolean(params.tailored);

    iframeMessenger.enableAutoResize();
    setupVisibilityMonitoring();
    parallel(
        [
            requests.spreadsheetRequest,
            params.tailored ? requests.tailorRequest : untailoredRequest,
        ],
        (err, [spreadsheetRes, tailorRes]) => {
            if (err) {
                throw err;
            }

            function getRowById(rows, rowId) {
                return rows.reduce((prev, row) => {
                    if (row.id === rowId) {
                        return row;
                    }

                    return prev;
                }, null);
            }

            function getTailoringLevel() {
                if (!isTailored) {
                    return 'untailored';
                }

                return tailorRes.level || params.default;
            }

            function getRowId(level) {
                if (!isTailored) {
                    return params.id;
                }

                return params[level];
            }

            const rows = spreadsheetRes.sheets.content;

            if (!rows || !rows.length) {
                throw new Error(`bad JSON response: ${JSON.stringify(spreadsheetRes)}`);
            }

            const level = getTailoringLevel();
            const id = getRowId(level);
            const row = getRowById(rows, id);

            if (!row) {
                throw new Error(`row with id ${id} not found`);
            }

            const format = formats[row.format];

            if (!format) {
                throw new Error(`format ${row.format} is not valid`);
            }

            const { template, postRender, preprocess } = format;
            const templateFn = dot.template(template, null, { feedback });
            const trackingCode = `brexit__${level}__${id}`;
            const rowData = preprocess(row);
            const templateData = {
                data: rowData,
                trackingCode: {
                    like: `${trackingCode}__like`,
                    dislike: `${trackingCode}__dislike`,
                },
            };
            render(templateFn, templateData, parentEl);
            postRender(rowData);
        }
    );
};
