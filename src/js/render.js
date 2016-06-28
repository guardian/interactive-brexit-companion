import surveyHTML from './text/survey.html!text';
import supporterHTML from './text/supporter.html!text';
import q from './lib/query';

function bindEventHandlers(atomId) {
    q('.js-feedback').forEach(el => el.addEventListener('click', ev => {
        const feedbackButton = ev.currentTarget;
        const feedback = feedbackButton.closest('.js-feedback-container');
        const surveyHref = feedbackButton.getAttribute('data-survey-href');

        if (el.classList.contains('explainer__button--dislike')) {
            feedback.innerHTML = surveyHTML.replace(/%surveyHref%/g, surveyHref);
        } else {
            feedback.innerHTML = supporterHTML.replace(/%atomId%/g, atomId);
        }
    }));
}

export default function render(templateFn, data, parentEl, atomId) {
    parentEl.innerHTML = templateFn(data); // eslint-disable-line no-param-reassign
    bindEventHandlers(atomId);
}
