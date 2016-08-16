import q from '../lib/query';
import markdown from '../lib/markdown';
import expandableTemplate from '../text/expandable.dot.html!text';

export default {
    preprocessFromExplainerApi(explainer) {
        const shortContentLength = 65;
        const htmlContentArray = markdown.getHtmlContentArray(explainer.body);
        const shortContent = htmlContentArray.slice(0, shortContentLength).join(' ');
        const allContent = htmlContentArray.join(' ');
        return {
            header: explainer.title,
            shortContent,
            allContent,
        };
    },
    postRender() {
        q('.js-expand').forEach(el => el.addEventListener('click', () => {
            q('.js-short-content').forEach(shortContentElement => {
                shortContentElement.classList.add('u-hidden');
            });
            q('.js-all-content').forEach(allContentElement => {
                allContentElement.classList.remove('u-hidden');
            });
        }));
        q('.js-collapse').forEach(el => el.addEventListener('click', () => {
            q('.js-all-content').forEach(allContentElement => {
                allContentElement.classList.add('u-hidden');
            });
            q('.js-short-content').forEach(shortContentElement => {
                shortContentElement.classList.remove('u-hidden');
            });
        }));
    },
    template: expandableTemplate,
};
