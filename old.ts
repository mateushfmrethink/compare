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
    const articles: Record<string, Article> = {};
    const textContent: FormattedContent['content']['textContent'] = [];
    const considerations: FormattedContent['content']['considerations'] = [];
    const termsOfUse: FormattedContent['content']['termsOfUse'] = [];

    Object.keys(content).forEach((key) => {
    const value = content[key as keyof AirTransportContractContent['content']]
      if (key.startsWith('considerations')) {
        considerations.push(value);
      } else if (key.startsWith('textContent') && !key.includes('article')) {
        textContent.push(value);
      }
      else if (
        key.startsWith('articleTitle') ||
        key.startsWith('articleTextContent')
      ) {
        const articleId = key.match(/-\d+/)?.[0] ?? '-0'
        const isTitle = key.startsWith('articleTitle')

        if(!articles[`articleTitle${articleId}`]){
          articles[`articleTitle${articleId}`] = {
            articleTitle: '',
            articleTextContent: []
          }
        }

        if(isTitle){
          articles[`articleTitle${articleId}`].articleTitle = value
        }else{
          articles[`articleTitle${articleId}`].articleTextContent.push(value)
        }

      } else if (key.startsWith('termsOfUse')) {
        termsOfUse.push(value);
      }
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
        articles: Object.values(articles),
        termsOfUse,
      },
    };
  };
