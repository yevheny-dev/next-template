import React from 'react';

import { Article, Title } from './components.tsx';

export const Typography = ({ children }: { children: string }) => {
  return <div>{children}</div>;
};

Typography.Title = Title;
Typography.Article = Article;
