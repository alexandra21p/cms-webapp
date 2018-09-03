import * as types from "../actions/actionTypes";

export default function templateReducer( state = {}, action ) {
    switch ( action.type ) {
        case types.GET_TEMPLATE_SUCCESS: {
            return Object.assign( {}, state, {
                currentTemplate: action.template,
            } );
        }
        case types.LOAD_TEMPLATES_SUCCESS: {
            return Object.assign(
                {},
                state,
                {
                    allTemplates: action.templates,
                    currentTemplate: {
                        name: "",
                        rootComponent: {},
                    },
                },
            );
        }
        case types.CREATE_TEMPLATE_SUCCESS: {
            return Object.assign( {}, state, {
                allTemplates: [ ...state.allTemplates, action.template ],
                currentTemplate: action.template,
            } );
        }
        case types.REMOVE_TEMPLATE: {
            const updatedTemplates = state.allTemplates.slice();
            const templateIndex = updatedTemplates.findIndex( ( { _id } ) => _id === action.id );
            updatedTemplates.splice( templateIndex, 1 );
            return Object.assign( {}, state, {
                allTemplates: updatedTemplates,
            } );
        }
        case types.SAVE_FONT_CHOICE: {
          return Object.assign({}, state, {
            fonts: state.fonts.includes[ action.font ]
            ? state.fonts : [...state.fonts, font]
          })
        }
        default:
            return state;
    }
}
