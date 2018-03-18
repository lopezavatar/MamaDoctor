const natural = require('natural');

module.exports = (userAnswer, possibleRightAnswers) => {
    const words = userAnswer.split(' ');
    let isRightAnswer = false;

    words.forEach((word) => {
        possibleRightAnswers.forEach((rightAnswer) => {
            const similarity = natural.JaroWinklerDistance(word, rightAnswer);

            if (similarity > 0.89) {
                isRightAnswer = true;
            }
        });
    });

    return isRightAnswer;
};
