export const extractOverviewFromHTML = ({
  DOMParser: DOMParserClass,
  HTMLMetaElement: HTMLMetaElementClass,
  html,
}: {
  DOMParser: typeof DOMParser;
  HTMLMetaElement: typeof HTMLMetaElement;
  html: string;
}) => {
  const domParser = new DOMParserClass();
  const document = domParser.parseFromString(html, "text/html");

  return [
    getTitle({ HTMLMetaElementClass, document }),
    getDescription({ HTMLMetaElementClass, document }),
    getHashTagLine({ HTMLMetaElementClass, document }),
  ]
    .filter((line) => line)
    .join("\n\n");
};

const getDescription = ({
  HTMLMetaElementClass,
  document,
}: {
  HTMLMetaElementClass: typeof HTMLMetaElement;
  document: Document;
}) => {
  const descriptionElement = document.querySelector(
    'meta[name="description" i]'
  );

  const ogDescriptionElement = document.querySelector(
    'meta[property="og:description" i]'
  );

  return (
    (ogDescriptionElement instanceof HTMLMetaElementClass &&
      ogDescriptionElement.content) ||
    (descriptionElement instanceof HTMLMetaElementClass &&
      descriptionElement.content) ||
    ""
  );
};

const getHashTagLine = ({
  HTMLMetaElementClass,
  document,
}: {
  HTMLMetaElementClass: typeof HTMLMetaElement;
  document: Document;
}) => {
  const keywordsElement = document.querySelector('meta[name="keywords" i]');

  const joinedKeywords =
    (keywordsElement instanceof HTMLMetaElementClass &&
      keywordsElement.content) ||
    "";

  const keywords = joinedKeywords.split(",").flatMap((keyword) => {
    const trimmedKeyword = keyword.trim();

    return trimmedKeyword === "" ? [] : [trimmedKeyword];
  });

  return keywords
    .map((keyword) => `#${keyword.replaceAll(" ", "_")}`)
    .join(" ");
};

const getTitle = ({
  HTMLMetaElementClass,
  document,
}: {
  HTMLMetaElementClass: typeof HTMLMetaElement;
  document: Document;
}) => {
  const ogTitleElement = document.querySelector('meta[property="og:title" i]');

  const title =
    (ogTitleElement instanceof HTMLMetaElementClass &&
      ogTitleElement.content) ||
    document.title;

  const credits = [
    ...document.querySelectorAll(
      'meta[name="author" i], meta[name="creator" i], meta[name="publisher" i]'
    ),
  ].flatMap((creditElement) =>
    creditElement instanceof HTMLMetaElementClass ? [creditElement.content] : []
  );

  const creditLine = credits.length < 1 ? "" : `by ${credits.join(", ")}`;

  return [title, creditLine].filter((line) => line).join("\n");
};
