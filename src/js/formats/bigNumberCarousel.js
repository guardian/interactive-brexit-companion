import carouselTemplate from '../text/carousel.dot.html!text';
import buildCarousel from './helpers/buildCarousel';

export default {
    preprocess(data) {
        const slides = [];
        const { survey_like, survey_dislike } = data;
        const newData = { survey_like, survey_dislike };
        const bigNumberMatcher = /(\d+|\/|\.)/g;
        const max = 5;
        let i = 1;
        let bigNumber;
        let content;

        for (; i <= max; i += 1) {
            bigNumber = data[`headline${i}`];
            content = data[`content${i}`];
            if (content && bigNumber) {
                bigNumber = bigNumber.replace(
                    bigNumberMatcher, '<span class="big-number">$1</span>'
                );
                slides.push({ bigNumber, content });
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
