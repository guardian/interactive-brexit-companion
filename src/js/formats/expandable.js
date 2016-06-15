import q from '../lib/query';
import markdown from '../lib/markdown';
import expandableTemplate from '../text/expandable.dot.html!text';

export default {
    preprocess({ content1: content, headline1: header, survey_like, survey_dislike }) {
        const shortContentLength = 65;
        const htmlContentArray = markdown.getHtmlContentArray(content);
        const shortContent = htmlContentArray.slice(0, shortContentLength).join(' ');
        const allContent = htmlContentArray.join(' ');

        return {
            header,
            shortContent,
            survey_like,
            survey_dislike,
            allContent,
        };
    },
    postRender() {
        const explainerEl = q('.explainer')[0];
        const expandLink = q('.js-expand')[0];
        const collapseLink = q('.js-collapse')[0];
        const shortContent = q('.js-short-content')[0];
        const initialHeight = explainerEl.offsetHeight;

        function expand() {
            q('.js-all-content').forEach((el) => {
                el.classList.remove('u-hidden');
            });
            shortContent.classList.add('u-hidden');

            // set to an excessive max height (will be reduced on `transitionend`)
            explainerEl.style.maxHeight = '1000px';
        }

        function collapse() {
            explainerEl.style.height = `${explainerEl.offsetHeight}px`;
            explainerEl.style.maxHeight = `${initialHeight}px`;
            q('.js-all-content').forEach((el) => {
                el.classList.add('u-hidden');
            });
            shortContent.classList.remove('u-hidden');
        }

        explainerEl.style.maxHeight = `${initialHeight}px`;
        explainerEl.addEventListener('transitionend', () => {
            explainerEl.style.maxHeight = `${explainerEl.offsetHeight}px`;
        });
        expandLink.addEventListener('click', expand);
        collapseLink.addEventListener('click', collapse);
    },
    template: expandableTemplate,
};
