import React from "react";
import { Helmet } from "react-helmet-async";

const ReactHelmet = ({ keywords, description, title, image, favicon }) => {
  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="MAINT" />
      <meta property="og:description" content={description} />
      <link rel="icon" type="image/png" href={favicon} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
};
export default ReactHelmet;
