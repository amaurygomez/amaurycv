import {
  countPrivacyMatches,
  publicCvs,
  readPdfText,
  readPrivacyTerms,
} from "./lib/cv-privacy.mjs";

function checkPublicPdfs() {
  let terms;
  try {
    terms = readPrivacyTerms();
  } catch {
    console.error("Could not read the local privacy list.");
    return 1;
  }

  if (!terms.length) {
    console.error("Set PRIVACY_DENYLIST or add terms to .privacy-denylist before checking.");
    return 1;
  }

  let failed = false;
  for (const { file } of publicCvs) {
    let text;
    try {
      text = readPdfText(file);
    } catch {
      console.error(
        `${file}: could not extract text. Check the PDF and install Poppler's pdftotext.`,
      );
      failed = true;
      continue;
    }

    const matches = countPrivacyMatches(text, terms);
    if (matches) {
      console.error(`${file}: ${matches} private-term match(es). Review the PDF locally.`);
      failed = true;
    } else {
      console.log(`${file}: no private-term matches.`);
    }
  }
  return failed ? 1 : 0;
}

process.exitCode = checkPublicPdfs();
