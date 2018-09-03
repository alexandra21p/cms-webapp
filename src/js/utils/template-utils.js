const getDefaultTemplateStructure = () => ( {
    tag: "div",
    styles: {
        height: "100%",
    },
    childElements: [
        {
            tag: "header",
            styles: {
                width: "100%",
                height: "30%",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
            },
            text: "this is the header",
        },
        {
            tag: "main",
            styles: {
                width: "100%",
                height: "60%",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
            },
            text: "this is the content",
        },
        {
            tag: "footer",
            styles: {
                width: "100%",
                height: "10%",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
            },
            text: "this is the footer",
        },
    ],
} );

const defaultStyling = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  height: 100%;
}
body {
  font-family: 'Raleway', sans-serif;
  height: 100%;
}
.wrapper {
  width: 100%;
  height: 1000px;
}
`;

const availableFonts = {
  "Raleway": "https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,600,700",
  "Montserrat": "https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,700",
  "Open Sans": "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700",
  "Lato": "https://fonts.googleapis.com/css?family=Lato:300,400,700,900",
  "Noto Sans": "https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700"
};

export {
    getDefaultTemplateStructure,
    availableFonts,
    defaultStyling
};
