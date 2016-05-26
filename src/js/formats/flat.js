import flatTemplate from '../text/flat.dot.html!text';

export default {
    preprocess({ headline1: header, content1: content }) {
        return { header, content };
    },
    postRender() {},
    template: flatTemplate,
};
