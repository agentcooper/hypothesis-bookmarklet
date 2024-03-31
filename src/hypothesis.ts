const BASE_URL = `https://api.hypothes.is/api`;

const username = "__USERNAME__";
const token = "__TOKEN__";

if (username.length === 0) {
  window.alert("Error: bookmarklet is not configured, 'username' is not set.");
}

if (token.length === 0) {
  window.alert("Error: bookmarklet is not configured, 'token' is not set.");
}

const commonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export interface HypothesisAnnotation {
  id: string;
  text: string;
  target: Array<{
    selector: Array<{ exact: string }>;
  }>;
}

export async function fetchAnnotations(): Promise<HypothesisAnnotation[]> {
  const url = new URL(`${BASE_URL}/search`);
  url.search = new URLSearchParams({
    user: `acct:${username}@hypothes.is`,
    uri: document.location.toString(),
  }).toString();
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: commonHeaders,
  });
  const content = await rawResponse.json();
  return content.rows;
}

export async function createAnnotation(text: string) {
  const rawResponse = await fetch(`${BASE_URL}/annotations`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({
      uri: document.location.toString(),
      document: {
        title: [document.title],
      },
      text: "",
      target: [
        {
          selector: [
            {
              type: "TextQuoteSelector",
              exact: text,
            },
          ],
        },
      ],
    }),
  });

  const annotation = await rawResponse.json();
  return annotation;
}

export async function deleteAnnotation(annotationId: string) {
  const rawResponse = await fetch(`${BASE_URL}/annotations/${annotationId}`, {
    method: "DELETE",
    headers: commonHeaders,
  });
  const content = await rawResponse.json();
  return content;
}

export async function updateAnnotation(
  annotationId: string,
  patch: Partial<HypothesisAnnotation>
) {
  const rawResponse = await fetch(`${BASE_URL}/annotations/${annotationId}`, {
    method: "PATCH",
    headers: commonHeaders,
    body: JSON.stringify({
      ...patch,
    }),
  });
  const content = await rawResponse.json();
  return content;
}
