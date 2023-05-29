type AirTransportContractContent = any
export type Article = {
    articleTitle: string;
    articleTextContent: string[];
}
  
export type FormattedContent = {
    id: string;
    content: {
        title: string;
        subtitle: string;
        firstParagraph: string;
        considerations: string[];
        firstDefinition: string;
        firstSubtitle: string;
        textContent: string[];
        articles: Article[];
        termsOfUse: string[];
    };
};
const formatContent = (
    contentRaw: AirTransportContractContent,
  ): FormattedContent => {
    const { content } = contentRaw;
    const {
      title,
      'title-1': subtitle,
      firstParagraph,
      firstDefinition,
      firstSubtitle,
    } = content;
    const articles: Article[] = [];
    const textContent: FormattedContent['content']['textContent'] = [];
    const considerations: FormattedContent['content']['considerations'] = [];
    const termsOfUse: FormattedContent['content']['termsOfUse'] = [];
    const articleTextContentFiltered: string[] = [];
  
    Object.keys(content).forEach((key) => {
      if (key.startsWith('considerations')) {
        considerations.push(
          content[key as keyof AirTransportContractContent['content']],
        );
      } else if (key.startsWith('textContent') && !key.includes('article')) {
        textContent.push(
          content[key as keyof AirTransportContractContent['content']],
        );
      } else if (
        key.startsWith('articleTitle') ||
        key.startsWith('articleTextContent')
      ) {
        articleTextContentFiltered.push(key);
      } else if (key.startsWith('termsOfUse')) {
        termsOfUse.push(
          content[key as keyof AirTransportContractContent['content']],
        );
      }
    });
  
    const titleList = articleTextContentFiltered.filter((obj) =>
      obj.includes('Title'),
    );
  
    titleList.forEach((_, i) => {
      const titleKey =
        i === 0
          ? 'articleTitle'
          : (`articleTitle-${i}` as keyof AirTransportContractContent['content']);
  
      const text = (
        i === 0
          ? articleTextContentFiltered.filter((obj) =>
              /(articleTextContent)$|((articleTextContent):?(Def-\d))/i.test(obj),
            )
          : articleTextContentFiltered.filter(
              (obj) => !obj.indexOf(`articleTextContent-${i}`),
            )
      ).map(
        (textKey) =>
          content[textKey as keyof AirTransportContractContent['content']],
      );
  
      const item: Article = {
        articleTitle: content[titleKey],
        articleTextContent: text,
      };
  
      articles.push(item);
    });
  
    return {
      id: contentRaw.id,
      content: {
        title,
        subtitle,
        firstParagraph,
        considerations,
        firstDefinition,
        firstSubtitle,
        textContent,
        articles,
        termsOfUse,
      },
    };
  };