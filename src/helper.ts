const specialCharacters = ["%", '"', "<", ">", "#", "@", " ", "\\&", "\\?"];

function urlencode(code: string) {
  return code.replace(
    new RegExp(specialCharacters.join("|"), "g"),
    encodeURIComponent
  );
}

function prefix(code: string) {
  return `javascript:${code}`;
}

export function createBookmarklet(code: string) {
  return prefix(urlencode(`(function() { ${code} })()`));
}
