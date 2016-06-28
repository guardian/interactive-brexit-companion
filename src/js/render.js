import thankYouHTML from './text/thankYou.html!text';
import q from './lib/query';

function bindEventHandlers(atomId) {
    q('.js-feedback').forEach(el => el.addEventListener('click', ev => {
        const feedbackButton = ev.currentTarget;
        const feedback = feedbackButton.closest('.js-feedback-container');
        const surveyHref = feedbackButton.getAttribute('data-survey-href');

        feedback.innerHTML = thankYouHTML.replace(/%surveyHref%/g, surveyHref).replace(/%atomId%/g, atomId);
    }));
}

export default function render(templateFn, data, parentEl, atomId) {
    parentEl.innerHTML = templateFn(data); // eslint-disable-line no-param-reassign
    bindEventHandlers(atomId);
}
