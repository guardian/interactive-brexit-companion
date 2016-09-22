import './lib/shims';
import iframeMessenger from 'guardian/iframe-messenger';
import dot from 'olado/doT';
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

function buildTemplateData(rowData, trackingCode, atomName) {
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
            atomName: `${atomName}`,
        },
    };
}

function getExplainer(response) {
    const explainer = response.response.explainer;

    if (!explainer) {
        throw new Error(`bad JSON response: ${JSON.stringify(response)}`);
    }

    return explainer;
}

function getFormat(displayType) {
    const format = formats[displayType];

    if (!format) {
        throw new Error(`format ${displayType} is not valid`);
    }

    return format;
}

function doRender(explainer, trackingCode, parentEl, atomName) {
    const format = getFormat(explainer.data.explainer.displayType);
    const { template, postRender, preprocessFromExplainerApi } = format;
    const templateFn = dot.template(template, null, { feedback });

    const renderData = preprocessFromExplainerApi(explainer.data.explainer);
    const templateData = buildTemplateData(renderData, trackingCode, atomName);

    render(templateFn, templateData, parentEl, explainer.id);
    postRender(templateData);
}

function urlEncodeJson(json) {
    return Object.keys(json).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(json[k])}`
        ).join('&');
}

window.ophanInteraction = function ophanInteraction(atomName, interactionValue) {
    const queryParams = urlEncodeJson({ viewId: window.guardian.ophan.pageViewId,
        component: atomName,
        value: interactionValue });
    const ophanUrl = `//ophan.theguardian.com/a.gif?${queryParams}`;
    const el = document.createElement('img');
    el.src = ophanUrl;
    el.style.display = 'none';
    document.body.appendChild(el);
};

window.init = function init(parentEl) {
    const params = getQueryParams();
    const defaultLevel = params.default || 'intermediate';
    const defaultAtomId = params.id;
    const atomName = `explainer_feedback__${defaultAtomId}`;

    iframeMessenger.enableAutoResize();

    function renderExplainMakerAtom(err, response) {
        if (err) {
            throw err;
        }
        const explainer = getExplainer(response);
        const trackingCode = `brexit__${defaultLevel}__${defaultAtomId}__untailored`;
        doRender(explainer, trackingCode, parentEl, atomName);
    }

    requests.explainerApiRequest(defaultAtomId, renderExplainMakerAtom);
};
