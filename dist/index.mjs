export const extractOverviewFromHTML = ({ DOMParser: DOMParserClass, HTMLMetaElement: HTMLMetaElementClass, html, }) => {
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
const getDescription = ({ HTMLMetaElementClass, document, }) => {
    const descriptionElement = document.querySelector('meta[name="description" i]');
    const ogDescriptionElement = document.querySelector('meta[property="og:description" i]');
    return ((ogDescriptionElement instanceof HTMLMetaElementClass &&
        ogDescriptionElement.content) ||
        (descriptionElement instanceof HTMLMetaElementClass &&
            descriptionElement.content) ||
        "");
};
const getHashTagLine = ({ HTMLMetaElementClass, document, }) => {
    const keywordsElement = document.querySelector('meta[name="keywords" i]');
    const joinedKeywords = (keywordsElement instanceof HTMLMetaElementClass &&
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
const getTitle = ({ HTMLMetaElementClass, document, }) => {
    const ogTitleElement = document.querySelector('meta[property="og:title" i]');
    return ((ogTitleElement instanceof HTMLMetaElementClass &&
        ogTitleElement.content) ||
        document.title);
};
