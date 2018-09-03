import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { saveAs } from "file-saver/FileSaver";

import generateStaticHtml from "../utils/generateStaticHtml";
import { kebabCase } from "../utils/helperMethods";
import { availableFonts, defaultStyling } from "../utils/template-utils";
import "../../css/publish.scss";

const getFontLinks = ( fonts ) => fonts.reduce(
    ( acc, font ) =>
        `<link href="${ availableFonts[ font ] }" rel="stylesheet">`
    , "",
);

class Publish extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            htmlFile: "",
            fileName: "",
        };

        this.generateMarkup = this.generateMarkup.bind( this );
        this.downloadPage = this.downloadPage.bind( this );
    }

    componentDidMount() {
        const { name } = this.props.template;
        const finalMarkup = this.generateMarkup();
        const fileName = `${ kebabCase( name ) }.html`;
        const blob = new Blob( [ finalMarkup ], { type: "text/html;charset=utf-8" } );
        setTimeout(() => {this.setState( { isLoading: false, htmlFile: blob, fileName } ); // eslint-disable-line
        }, 3000 );
    }

    generateMarkup() { // eslint-disable-line
        const { name, rootComponent } = this.props.template;
        const { fonts } = this.props;
        const fontLinks = fonts.length > 0 ? getFontLinks( fonts )
            : '<link href="https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,600,700" rel="stylesheet">';
        const content = generateStaticHtml( [ rootComponent ] );
        const styles = document.querySelector( "style[data-styled-components]" ).textContent;

        return `
      <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <title>${ name }</title>
            ${ fontLinks }
            <style>${ defaultStyling }</style>
            <style>${ styles }</style>
        </head>
        <body>
          <div class="wrapper">
            ${ content }
          </div>
        </body/>
      </html>
      `;
    }

    downloadPage() {
        const { fileName, htmlFile } = this.state;
        saveAs( htmlFile, fileName );
    }

    render() {
        const { isLoading } = this.state;

        return (
            <div className="publish-page">
                { isLoading ? <h1>Generating your page...</h1>
                    : (
                        <div>
                            <h1>You{"'"}re all set! You can download the html of your page now.</h1>
                            <button
                                onClick={ this.downloadPage }
                                className="download"
                            >gimme
                            </button>
                        </div>
                    )
                }
            </div>
        );
    }
}

Publish.propTypes = {
    template: PropTypes.object.isRequired,
    fonts: PropTypes.array.isRequired,
};

// Publish.defaultProps = {
//     template: null,
// };

const mapStateToProps = ( state ) => ( {
    template: state.templates.currentTemplate,
    fonts: state.templates.fonts,
} );

export default connect( mapStateToProps, null )( Publish );
