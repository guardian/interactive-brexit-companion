import carouselTemplate from '../text/carousel.dot.html!text';
import buildCarousel from './helpers/buildCarousel';

export default {
    preprocess(data) {
        const slides = [];
        const { survey_like, survey_dislike } = data;
        const newData = { survey_like, survey_dislike };
        const max = 5;
        let i = 1;
        let header;
        let content;

        for (; i <= max; i += 1) {
            header = data[`headline${i}`];
            content = data[`content${i}`];
            if (typeof header !== 'undefined' && typeof content !== 'undefined') {
                slides.push({ header, content });
            }
        }
        newData.slides = slides;

        return newData;
    },
    postRender(data) {
        const slideCount = data.slides.length;

        buildCarousel(slideCount);
    },
    template: carouselTemplate,
};
