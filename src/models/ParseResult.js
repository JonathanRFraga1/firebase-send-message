class ParseResult {
    static parse = (result, registrationTokens) => {
        let success = result.successCount;
        let failure = result.failureCount;

        let errorMessages = [
            'messaging/invalid-registration-token',
            'messaging/registration-token-not-registered'
        ];

        let errorTokens = [];

        for (let i = 0; i < result.results.length; i++) {
            if (result.results[i].error) {
                if (errorMessages.includes(result.results[i].error.code)) {
                    errorTokens.push(registrationTokens[i]);
                }
            }
        }

        result = {
            success: success,
            failure: failure,
            errorTokens: errorTokens
        }

        return result;
    }
}

export default ParseResult;