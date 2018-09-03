import React from "react";
import PropTypes from "prop-types";

import DefaultComponent from "./DefaultComponent";

class CustomComponents extends React.Component {
    constructor() {
        super();
        this.state = {
            activeCategory: null,
        };
        this.categorize = this.categorize.bind( this );
        this.onDragStart = this.onDragStart.bind( this );
    }

    onDragStart( evt, data ) {
        const { dragStartHandler } = this.props;
        dragStartHandler( evt, data );
        this.setState( { activeCategory: null } );
    }

    categorize() {
        const { components } = this.props;
        return components.reduce( ( acc, comp ) => {
            const implicitProp = comp.customName || comp.tag;
            if ( !acc.hasOwnProperty( implicitProp ) ) { // eslint-disable-line
                return {
                    ...acc,
                    [ implicitProp ]: [ comp ],
                };
            }
            return {
                ...acc,
                [ implicitProp ]: [ ...acc[ implicitProp ], comp ],
            };
        }, {} );
    }

    render() {
        const { dragEndHandler } = this.props;
        const { activeCategory } = this.state;
        const categorizedComponents = this.categorize();

        return (
            <div className="components">
                <h2 className="defaults-section-title">custom components</h2>
                {
                    Object.keys( categorizedComponents ).map( category =>
                        (
                            <div
                                className={ `${ activeCategory === category
                                    ? "component-section active-category" : "component-section" }` }
                                onClick={ () => {
                                    this.setState( {
                                        activeCategory: category === activeCategory
                                            ? null : category,
                                    } );
                                } }
                            >
                                <h4>{ category }</h4>
                                <div className="components-category-view">
                                    <h3 className="category-title">{ category }</h3>
                                    <button
                                        className="exit-component-view"
                                        onClick={ () => {
                                            this.setState( { activeCategory: null } );
                                        } }
                                    />
                                    {categorizedComponents[ category ].map( comp =>
                                        (
                                            <DefaultComponent
                                                data={ comp }
                                                dragStartHandler={ this.onDragStart }
                                                dragEndHandler={ dragEndHandler }
                                            />
                                        ) )}
                                </div>
                            </div>
                        ) )
                }
            </div>
        );
    }
}

CustomComponents.propTypes = {
    components: PropTypes.array.isRequired,
    dragStartHandler: PropTypes.func.isRequired,
    dragEndHandler: PropTypes.func.isRequired,
};

export default CustomComponents;
