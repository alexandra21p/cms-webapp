import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TemplateComponent from "../components/TemplateComponent";

const generateStaticHtml = ( data ) => `<!DOCTYPE html>${ renderToStaticMarkup( data.map( comp => (
    <TemplateComponent key={ comp._id } { ...comp } />
) ) ) }`;

export default generateStaticHtml;
