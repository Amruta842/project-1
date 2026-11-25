
/* KisanSense Kannada Voice Module */

// Start Kannada voice recognition
function startKannadaRecognition(onResult, onError) {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "kn-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
        const question =
            event.results[0][0].transcript;

        if (onResult) {
            onResult(question);
        }
    };

    recognition.onerror = function (event) {
        if (onError) {
            onError(event.error);
        }
    };

    recognition.start();
}
