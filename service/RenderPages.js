'use strict';
var logger = require('../logger');
var Translator  = require('../service/Translator');
var lineBotId = process.env.LINE_BOT_CHANNEL_ID;

// setting default variables
function RenderPage() {
    if (!(this instanceof RenderPage)) return new RenderPage();
    this.lineBotId = process.env.LINE_BOT_CHANNEL_ID;
    this.translator = Translator();
}

RenderPage.prototype = {
    fetchData,
    successForm,
    errorForm
};

function fetchData(data) {
    var self = this;
    logger.info('fetch data for rendering in form');
    var renderData = {
        error: data.error,
        errors: data.errors,
        token: data.token,
        lineID: data.lineID,
        csrfToken: data.csrfToken,
        verified: data.verified,
        customError: data.customError,
        title: self.translator.get('verify.panelTitle'),
        panelTitle: self.translator.get('verify.label.panelTitle'),
        verifyButtonText: self.translator.get('verify.button.verify'),
        usernamePlaceholder: self.translator.get('verify.placeHolder.username'),
        passwordPlaceholder: self.translator.get('verify.placeHolder.password')
    }

    return renderData;
}

function successForm() {
    var self = this;
    logger.info('get data for rendering in success form');
    var successObject =  {
        title: self.translator.get('verify.successTextTitle'), 
        description: self.translator.get('verify.successTextMessage'),
        successButtonText: self.translator.get('verify.closeWindow'),
        lineBotId: lineBotId
    }

    return successObject;
}

function errorForm(data) {
    logger.info('get data for rendering in error form');
    var errorObject =  {
        message: data.message,
        backButtonText: data.backButtonText,
        lineBotId: lineBotId
    }

    return errorObject;
}

module.exports = RenderPage;