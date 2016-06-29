import './lib/shims';
import iframeMessenger from 'guardian/iframe-messenger';
import dot from 'olado/doT';
import parallel from 'async.parallel';
import formats from './formats/index';
import feedback from './text/feedback.dot.partial.html!text';
import render from './render';
import requests from './requests';


function getQueryParams() {
    const query = window.location.search.replace('?', '').split('&');
    const params = {};

    query.forEach(q => {
        const keyVal = q.split('=');
        params[keyVal[0]] = keyVal[1];
    });

    return params;
}

function getRowById(rows, rowId) {
    const row = rows.reduce((prev, currentRow) => {
        if (currentRow.id.trim() === rowId) {
            return currentRow;
        }

        return prev;
    }, null);

    if (!row) {
        throw new Error(`row with id ${rowId} not found`);
    }

    return row;
}

function buildTemplateData(rowData, trackingCode) {
    return {
        data: rowData,
        trackingCode: {
            like: `${trackingCode}__like`,
            dislike: `${trackingCode}__dislike`,
            more: `${trackingCode}__more`,
            less: `${trackingCode}__less`,
            prev: `${trackingCode}__prev`,
            next: `${trackingCode}__next`,
            goTo: `${trackingCode}__go_to`,
            back: `${trackingCode}__back`,
            catchMeUp: `${trackingCode}__catch_me_up`,
            signup: `${trackingCode}__signup`,
        },
    };
}

function getRows(response) {
    const rows = response.sheets.content;

    if (!rows || !rows.length) {
        throw new Error(`bad JSON response: ${JSON.stringify(response)}`);
    }

    return rows;
}

function getFormat(row) {
    const format = formats[row.format];

    if (!format) {
        throw new Error(`format ${row.format} is not valid`);
    }

    return format;
}

function doRender(row, trackingCode, parentEl) {
    const format = getFormat(row);
    const { template, postRender, preprocess } = format;
    const templateFn = dot.template(template, null, { feedback });
    const rowData = preprocess(row);
    const templateData = buildTemplateData(rowData, trackingCode);

    render(templateFn, templateData, parentEl, row.id);
    postRender(rowData);
}


window.init = function init(parentEl) {
    const params = getQueryParams();
    const isTailored = (params.tailored === 'true');
    const defaultLevel = params.default || 'intermediate';
    const defaultAtomId = params[defaultLevel] || params.id;

    iframeMessenger.enableAutoResize();

    function renderTailoredAtom(err, responses) {
        if (err) {
            throw err;
        }
        const spreadsheetRes = responses[0];
        const tailorRes = responses[1];
        const rows = getRows(spreadsheetRes);
        const level = tailorRes.level || defaultLevel;
        const id = params[level];
        const row = getRowById(rows, id);
        const trackingCode = `brexit__${level}__${id}__tailored`;

        doRender(row, trackingCode, parentEl);
    }

    function renderUntailoredAtom(err, responses) {
        if (err) {
            throw err;
        }
        const spreadsheetRes = responses[0];
        const rows = getRows(spreadsheetRes);
        const id = defaultAtomId;
        const row = getRowById(rows, id);
        const trackingCode = `brexit__${row.level}__${id}__untailored`;

        doRender(row, trackingCode, parentEl);
    }

    parallel(
        [
            requests.spreadsheetRequest,
            isTailored ? requests.tailorRequest : callback => callback(null, {}),
        ],
        isTailored ? renderTailoredAtom : renderUntailoredAtom
    );
};
