const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const GEMINI_BASE_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class GeminiConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiConfigError';
  }
}

export class GeminiApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

function assertConfigured() {
  if (!GEMINI_API_KEY) {
    throw new GeminiConfigError(
      'Gemini API key is missing. Set VITE_GEMINI_API_KEY in your environment.'
    );
  }
}

function buildPrompt(mood) {
  return [
    'You are a movie recommendation engine.',
    `The user is feeling: "${mood}".`,
    'Recommend exactly one real existing movie that matches this mood.',
    'Return only the movie title.',
    'Do not include quotation marks.',
    'Do not include explanations.',
    'Do not include markdown.',
    'Do not include the release year.',
    'Do not include any extra text.',
  ].join(' ');
}

export function sanitizeMovieTitle(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let title = rawText.trim();

  title = title.split('\n')[0].trim();
  title = title.replace(/[*_`#]+/g, '');
  title = title.replace(
    /^(title|movie|answer|recommendation)\s*[:\-]\s*/i,
    ''
  );
  title = title.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');
  title = title.replace(/\s+/g, ' ').trim();

  return title;
}

async function getGeminiErrorMessage(response) {
  const fallbackMessage =
    `Gemini request failed with status ${response.status}.`;

  try {
    const errorData = await response.json();

    return (
      errorData?.error?.message ||
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

export async function getMovieRecommendationFromMood(mood, signal) {
  assertConfigured();

  const trimmedMood = String(mood || '').trim();

  if (!trimmedMood) {
    throw new GeminiApiError(
      'Please enter a mood before searching.'
    );
  }

  let response;

  try {
    response = await fetch(
      `${GEMINI_BASE_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: buildPrompt(trimmedMood),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 32,
          },
        }),
      }
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    if (error?.name === 'AbortError') {
      throw error;
    }

    throw new GeminiApiError(
      'Network error while contacting Gemini.'
    );
  }

  if (!response.ok) {
    const message = await getGeminiErrorMessage(response);
    throw new GeminiApiError(message);
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new GeminiApiError(
      'Gemini returned a malformed response.'
    );
  }

  const rawText =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join(' ')
      .trim() || '';

  const title = sanitizeMovieTitle(rawText);

  if (!title) {
    const blockReason =
      data?.promptFeedback?.blockReason;

    if (blockReason) {
      throw new GeminiApiError(
        `Gemini blocked the request: ${blockReason}.`
      );
    }

    throw new GeminiApiError(
      'Gemini did not return a usable movie title.'
    );
  }

  return title;
}