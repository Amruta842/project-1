
/*
 * KisanSense - Kannada Voice Interface
 * Backend connection placeholder is preserved.
 */

// Backend URL will be added after backend deployment.
const API_URL = "";

let lastAnswer =
    "ನಮಸ್ಕಾರ, ಕಿಸಾನ್ ಸೆನ್ಸ್‌ಗೆ ಸ್ವಾಗತ";

function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        document.getElementById("result").innerText =
            "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "kn-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        document.getElementById("result").innerText =
            "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ...";
    };

    recognition.onresult = async function (event) {
        const question =
            event.results[0][0].transcript;

        document.getElementById("result").innerText =
            "ನಿಮ್ಮ ಪ್ರಶ್ನೆ: " + question +
            "\n\nಉತ್ತರವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...";

        await getBackendAnswer(question);
    };

    recognition.onerror = function () {
        document.getElementById("result").innerText =
            "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯಲ್ಲಿ ಸಮಸ್ಯೆ ಉಂಟಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.";
    };

    recognition.start();
}

async function getBackendAnswer(question) {
    const result =
        document.getElementById("result");

    // Backend connection will be added later.
    if (API_URL === "") {
        lastAnswer =
            "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. " +
            "ನಿಖರವಾದ ಉತ್ತರಕ್ಕಾಗಿ ಬೆಲೆ ಮಾಹಿತಿ ಮತ್ತು " +
            "ಮುನ್ಸೂಚನೆ ನೀಡುವ ಸರ್ವರ್ ಸಂಪರ್ಕ ಅಗತ್ಯ.";

        result.innerText =
            "ನಿಮ್ಮ ಪ್ರಶ್ನೆ: " + question +
            "\n\n" + lastAnswer;

        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question,
                language: "kn-IN"
            })
        });

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();

        lastAnswer = data.answer;

        result.innerText =
            "ನಿಮ್ಮ ಪ್ರಶ್ನೆ: " + question +
            "\n\nಕಿಸಾನ್ ಸೆನ್ಸ್ ಉತ್ತರ: " + lastAnswer;

    } catch (error) {
        lastAnswer =
            "ಸರ್ವರ್ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. " +
            "ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.";

        result.innerText = lastAnswer;
    }
}

function speakKannada() {
    const message =
        new SpeechSynthesisUtterance(lastAnswer);

    message.lang = "kn-IN";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(message);
}
