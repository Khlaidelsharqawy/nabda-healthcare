// Web Speech API interfaces for TypeScript
interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

/**
 * Text-To-Speech (TTS) - Reads out prescriptions, dates, and instructions in natural Arabic or English
 */
export function speakText(text: string, lang: 'ar' | 'en' = 'ar'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95; // Slightly calmer pace for medical readability
    utterance.pitch = 1.0;

    // Attempt to pick a high quality Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang === 'ar' ? 'ar' : 'en'));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}

/**
 * Speech-To-Text (STT) - Listens to patient or doctor voice inquiries
 */
let activeRecognition: SpeechRecognitionLike | null = null;

export function startVoiceRecognition(
  onTranscript: (text: string, isFinal: boolean) => void,
  onError?: (err: string) => void,
  lang: 'ar' | 'en' = 'ar'
): boolean {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    onError?.('Speech recognition is not supported in this browser.');
    return false;
  }

  stopVoiceRecognition();

  try {
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript + ' ';
        } else {
          interim += item[0].transcript;
        }
      }
      onTranscript(final || interim, Boolean(final));
    };

    recognition.onerror = (e) => {
      onError?.(e.error);
    };

    recognition.onend = () => {
      activeRecognition = null;
    };

    recognition.start();
    activeRecognition = recognition;
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed starting speech recognition';
    onError?.(msg);
    return false;
  }
}

export function stopVoiceRecognition(): void {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // Ignore if already stopped
    }
    activeRecognition = null;
  }
}
