import twoSidedTemplate from '../text/twoSided.dot.html!text';
import q from '../lib/query';
import slider from './helpers/slider';

export default {
    preprocess({
        headline1: question,
        headline2: answer_1_title,
        content2: answer_1_body,
        headline3: answer_2_title,
        content3: answer_2_body,
    }) {
        return {
            question,
            answer_1_title,
            answer_1_body,
            answer_2_title,
            answer_2_body,
        };
    },
    postRender() {
        function goToAnswer(answer) {
            q(`.js-back-to-question[data-answer="${answer}"]`).forEach(el => {
                el.classList.remove('u-hidden');
            });
            q('.js-go-to-answer').forEach(el => {
                el.classList.add('u-hidden');
            });
            if (answer === 'one') {
                slider.slideLeft();
            } else {
                slider.slideRight();
            }
        }

        function backToQuestion() {
            slider.reset();
            q('.js-back-to-question').forEach(el => el.classList.add('u-hidden'));
            q('.js-go-to-answer').forEach(el => el.classList.remove('u-hidden'));
        }

        q('.js-go-to-answer').forEach(el => {
            el.addEventListener('click', () => goToAnswer(el.getAttribute('data-answer')));
        });
        q('.js-back-to-question').forEach(el => {
            el.addEventListener('click', () => backToQuestion());
        });
    },
    template: twoSidedTemplate,
};
