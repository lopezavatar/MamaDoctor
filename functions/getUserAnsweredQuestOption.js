const validateQuestAnswer = require('./validateQuestAnswer');

module.exports = (userMessage, answerOptions) => {
    let userOption = { value: null, };

    answerOptions.options.forEach((option) => {
        const isUserAnswer = validateQuestAnswer(userMessage, option.synonyms);

        if (isUserAnswer) {
            userOption = option;
        }
    });

    return userOption;
};
