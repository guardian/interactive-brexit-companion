import q from '../lib/query';
import expandableTemplate from '../text/expandable.dot.html!text';

export default {
    preprocess({ content1: content, headline1: header }) {
        const words = content.split(' ');
        const mainContentLength = 65;
        const mainContent = words.slice(0, mainContentLength).join(' ');
        const extraContent = words.slice(mainContentLength).join(' ');

        return { header, mainContent, extraContent };
    },
    postRender() {
        q('.js-expand').forEach(el => el.addEventListener('click', ev => {
            const readMoreLink = ev.currentTarget;

            q('.js-extra-content').forEach(extraContentElement => {
                extraContentElement.classList.remove('u-hidden');
            });
            readMoreLink.remove();
        }));
    },
    template: expandableTemplate,
};
