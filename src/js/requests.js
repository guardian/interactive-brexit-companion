import config from '../config/application.json!json';
import reqwest from 'reqwest';

export default {
    explainerApiRequest(explainerId, callback) {
        reqwest({
            url: config.explainerApiUrl + explainerId,
            type: 'json',
            crossOrigin: false,
            error(err) {
                callback(err);
            },
            success(res) {
                callback(null, res);
            },
        });
    }
};
