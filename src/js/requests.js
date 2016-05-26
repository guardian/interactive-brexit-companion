import config from '../config/application.json!json';
import reqwest from 'reqwest';

export default {
    spreadsheetRequest(callback) {
        reqwest({
            url: config.spreadsheetUrl,
            type: 'json',
            crossOrigin: false,
            error(err) {
                callback(err);
            },
            success(res) {
                callback(null, res);
            },
        });
    },
    tailorRequest(callback) {
        reqwest({
            url: config.tailorUrl,
            type: 'json',
            crossOrigin: true,
            withCredentials: true,
            error() {
                callback(null, {});
            },
            success(res) {
                const count = res.viewedTags['politics/eu-referendum'];
                let level;

                if (count < 5) {
                    level = 'beginner';
                } else if (count > 9) {
                    level = 'advanced';
                } else {
                    level = 'intermediate';
                }
                callback(null, { level });
            },
        });
    },
};
