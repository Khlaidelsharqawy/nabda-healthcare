import { useState, useEffect, useCallback } from 'react';
import {
  speakText,
  stopSpeaking,
  startVoiceRecognition,
  stopVoiceRecognition,
  isSpeaking as checkIsSpeaking,
} from '../services/voiceService';

export function useVoiceGuide(defaultLang: 'ar' | 'en' = 'ar') {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Periodic check if speech ended
  useEffect(() => {
    let timer: any;
    if (speaking) {
      timer = setInterval(() => {
        if (!checkIsSpeaking()) {
          setSpeaking(false);
        }
      }, 300);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [speaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopVoiceRecognition();
    };
  }, []);

  const speak = useCallback(async (text: string, lang: 'ar' | 'en' = defaultLang) => {
    try {
      setSpeaking(true);
      await speakText(text, lang);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSpeaking(false);
    }
  }, [defaultLang]);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  const startListening = useCallback((onResult?: (text: string) => void, lang: 'ar' | 'en' = defaultLang) => {
    setError(null);
    setTranscript('');

    const started = startVoiceRecognition(
      (text, isFinal) => {
        setTranscript(text);
        if (onResult) onResult(text);
        if (isFinal) {
          // can keep listening if continuous
        }
      },
      (err) => {
        setError(err);
        setListening(false);
      },
      lang
    );

    if (started) {
      setListening(true);
    }
  }, [defaultLang]);

  const stopListening = useCallback(() => {
    stopVoiceRecognition();
    setListening(false);
  }, []);

  return {
    speaking,
    listening,
    transcript,
    error,
    speak,
    stop,
    startListening,
    stopListening,
  };
}
