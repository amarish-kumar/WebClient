import _ from 'lodash';
import { openWindow, parseURL } from '../../../helpers/browser';

/* @ngInject */
function unsubscribeModel(authentication, dispatchers, addressesModel, gettextCatalog, messageModel, notification, simpleSend) {

    const LIST = [];
    const UNSUBSCRIBE_REGEX = /<(.*?)>/g;

    const { dispatcher, on } = dispatchers(['message']);

    const successMessage = gettextCatalog.getString('Unsubscribed', null, 'Success notification');

    function already(list = '') {
        if (list.length) {
            return _.includes(LIST, list);
        }
        return false;
    }

    function sendMessage(value = '', addressID) {
        const message = messageModel();
        const mailto = value.replace('mailto:', '');
        let j = mailto.indexOf('?');

        if (j < 0) {
            j = mailto.length;
        }

        const to = mailto.substring(0, j);
        const { searchObject = {} } = parseURL(mailto.substring(j + 1));
        const { ID } = addressesModel.getFirst();

        message.AddressID = addressID || ID;
        message.From = addressesModel.getByID(message.AddressID);
        message.Password = '';
        message.AutoSaveContacts = 0; // Override the global settings value to prevent auto adding recipients to contacts

        if (to) {
            message.ToList = to.split(',').map((email) => ({ Address: email, Name: email }));
        }

        if (searchObject.subject) {
            message.Subject = searchObject.subject;
        }

        if (searchObject.body) {
            message.setDecryptedBody(searchObject.body);
        }

        return simpleSend(message).then(() => notification.success(successMessage));
    }

    function unsubscribe(message = {}) {
        const list = message.getListUnsubscribe();
        const matches = (list.match(UNSUBSCRIBE_REGEX) || []).map((m) => m.replace('<', '').replace('>', ''));
        const addressID = message.AddressID;

        _.each(matches, (value = '') => {
            value.startsWith('mailto:') && sendMessage(value, addressID);
            value.startsWith('http') && openWindow(value);
        });

        LIST.push(list);
        dispatcher.message('unsubscribed', { message });
    }

    /**
     * Know if we unsubscribe with link or message method
     * @param  {Object}  message
     * @param  {String}  type: 'http' or 'mailto:'
     * @return {Boolean}
     */
    function beginsWith(message, type) {
        const list = message.getListUnsubscribe();
        const matches = (list.match(UNSUBSCRIBE_REGEX) || []).map((m) => m.replace('<', '').replace('>', ''));

        return _.find(matches, (value = '') => value.startsWith(type));
    }

    on('message', (event, { type, data = {} }) => {
        type === 'unsubscribe' && unsubscribe(data.message);
    });

    return { init: angular.noop, already, beginsWith };
}
export default unsubscribeModel;
