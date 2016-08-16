import flatTemplate from '../text/flat.dot.html!text';
import markdown from '../lib/markdown';

export default {
    preprocessFromExplainerApi(explainer) {
        const content = markdown.getHtmlContentString(explainer.body);
        return {
            header: explainer.title,
            content,
        };
    },
    postRender() {
    },
    template: flatTemplate,
};
