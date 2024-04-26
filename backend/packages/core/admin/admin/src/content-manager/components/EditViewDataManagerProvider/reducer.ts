import { generateNKeysBetween } from 'fractional-indexing';
import produce from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';
import unset from 'lodash/unset';

import { CREATOR_FIELDS } from '../../constants/attributes';
import { getMaxTempKey } from '../../utils/fields';

import { findAllAndReplace } from './utils/findAllAndReplace';
import { moveFields } from './utils/moveFields';

import type { FormattedComponentLayout, FormattedContentTypeLayout } from '../../utils/layouts';
import type { Attribute, Entity } from '@strapi/types';

interface EditViewDataManagerState {
  componentsDataStructure: Record<string, any>;
  contentTypeDataStructure: Record<string, any>;
  formErrors: Record<string, any>;
  initialData: Record<string, Attribute.GetValue<Attribute.Any>>;
  modifiedData: Record<string, Attribute.GetValue<Attribute.Any>>;
  shouldCheckErrors: boolean;
  modifiedDZName: string | null;
  publishConfirmation: {
    show: boolean;
    draftCount: number;
  };
}

const initialState = {
  componentsDataStructure: {},
  contentTypeDataStructure: {},
  formErrors: {},
  initialData: {},
  modifiedData: {},
  shouldCheckErrors: false,
  modifiedDZName: null,
  publishConfirmation: {
    show: false,
    draftCount: 0,
  },
} satisfies EditViewDataManagerState;

interface AddNonRepeatableComponentToFieldAction {
  type: 'ADD_NON_REPEATABLE_COMPONENT_TO_FIELD';
  componentLayoutData: FormattedComponentLayout;
  allComponents: Record<string, FormattedComponentLayout>;
  keys: string[];
}

interface AddComponentToDynamicZoneAction {
  type: 'ADD_COMPONENT_TO_DYNAMIC_ZONE';
  componentLayoutData: FormattedComponentLayout;
  allComponents: Record<string, FormattedComponentLayout>;
  keys: string[];
  shouldCheckErrors: boolean;
  position?: number;
}

interface AddRepeatableComponentToFieldAction
  extends Omit<AddComponentToDynamicZoneAction, 'type'> {
  type: 'ADD_REPEATABLE_COMPONENT_TO_FIELD';
}

interface LoadRelationAction {
  type: 'LOAD_RELATION';
  initialDataPath: string[];
  modifiedDataPath: string[];
  value: Omit<RelationData, '__temp_key__'>[];
}

interface ConnectRelationAction {
  type: 'CONNECT_RELATION';
  keys: string[];
  value: Omit<RelationData, '__temp_key__'>;
  toOneRelation?: boolean;
}

interface DisconnectRelationAction {
  type: 'DISCONNECT_RELATION';
  keys: string[];
  id: Entity.ID;
}

interface MoveComponentFieldAction {
  type: 'MOVE_COMPONENT_FIELD';
  keys: string[];
  oldIndex: number;
  newIndex: number;
}

interface MoveComponentUpAction {
  type: 'MOVE_COMPONENT_UP';
  currentIndex: number;
  dynamicZoneName: string;
  shouldCheckErrors: boolean;
}

interface MoveComponentDownAction extends Omit<MoveComponentUpAction, 'type'> {
  type: 'MOVE_COMPONENT_DOWN';
}

interface MoveFieldAction {
  type: 'MOVE_FIELD';
  keys: string[];
  dragIndex: number;
  overIndex: number;
}

interface InitFormAction {
  type: 'INIT_FORM';
  initialValues: Record<string, any>;
  components: Record<string, FormattedComponentLayout>;
  attributes: FormattedContentTypeLayout['attributes'];
  setModifiedDataOnly?: boolean;
}

interface OnChangeAction {
  type: 'ON_CHANGE';
  keys: string[];
  value: Attribute.GetValue<Attribute.Any>;
  shouldSetInitialValue?: boolean;
}

interface RemoveComponentFromDynamicZoneAction {
  type: 'REMOVE_COMPONENT_FROM_DYNAMIC_ZONE';
  dynamicZoneName: string;
  index: number;
  shouldCheckErrors: boolean;
}

interface RemoveComponentFromFieldAction {
  type: 'REMOVE_COMPONENT_FROM_FIELD';
  keys: string[];
}

interface RemovePasswordFieldAction {
  type: 'REMOVE_PASSWORD_FIELD';
  keys: string[];
}

interface RemoveRepeatableFieldAction {
  type: 'REMOVE_REPEATABLE_FIELD';
  keys: string[];
}

interface ReorderRelationAction {
  type: 'REORDER_RELATION';
  keys: string[];
  oldIndex: number;
  newIndex: number;
}

interface SetDefaultDataStructuresAction {
  type: 'SET_DEFAULT_DATA_STRUCTURES';
  componentsDataStructure: Record<string, any>;
  contentTypeDataStructure: Record<string, any>;
}

interface SetFormErrorsAction {
  type: 'SET_FORM_ERRORS';
  errors: Record<string, any>;
}

interface TriggerFormValidationAction {
  type: 'TRIGGER_FORM_VALIDATION';
}

interface SetPublishConfirmationAction {
  type: 'SET_PUBLISH_CONFIRMATION';
  publishConfirmation: {
    show: boolean;
    draftCount: number;
  };
}

interface ResetPublishConfirmationAction {
  type: 'RESET_PUBLISH_CONFIRMATION';
}

type Action =
  | AddNonRepeatableComponentToFieldAction
  | AddComponentToDynamicZoneAction
  | AddRepeatableComponentToFieldAction
  | LoadRelationAction
  | ConnectRelationAction
  | DisconnectRelationAction
  | MoveComponentFieldAction
  | MoveComponentUpAction
  | MoveComponentDownAction
  | MoveFieldAction
  | InitFormAction
  | OnChangeAction
  | RemoveComponentFromDynamicZoneAction
  | RemoveComponentFromFieldAction
  | RemovePasswordFieldAction
  | RemoveRepeatableFieldAction
  | ReorderRelationAction
  | SetDefaultDataStructuresAction
  | SetFormErrorsAction
  | TriggerFormValidationAction
  | SetPublishConfirmationAction
  | ResetPublishConfirmationAction;

export interface RelationData {
  id: Entity.ID;
  __temp_key__: number;
}

const reducer = (state: EditViewDataManagerState, action: Action) =>
  // eslint-disable-next-line consistent-return
  produce(state, (draftState) => {
    switch (action.type) {
      case 'ADD_NON_REPEATABLE_COMPONENT_TO_FIELD': {
        const { componentLayoutData, allComponents } = action;

        const defaultDataStructure = {
          ...state.componentsDataStructure[componentLayoutData.uid],
        };

        const findAllRelationsAndReplaceWithEmptyArray = findAllAndReplace(
          allComponents,
          (value) => value.type === 'relation',
          []
        );

        const componentDataStructure = findAllRelationsAndReplaceWithEmptyArray(
          defaultDataStructure,
          componentLayoutData.attributes
        );

        set(draftState, ['modifiedData', ...action.keys], componentDataStructure);

        break;
      }
      case 'ADD_COMPONENT_TO_DYNAMIC_ZONE':
      case 'ADD_REPEATABLE_COMPONENT_TO_FIELD': {
        const {
          keys,
          allComponents,
          componentLayoutData,
          shouldCheckErrors,
          position = undefined,
        } = action;

        if (shouldCheckErrors) {
          draftState.shouldCheckErrors = !state.shouldCheckErrors;
        }

        if (action.type === 'ADD_COMPONENT_TO_DYNAMIC_ZONE') {
          draftState.modifiedDZName = keys[0];
        }

        const currentValue = [...get(state, ['modifiedData', ...keys], [])];

        let actualPosition = position;

        if (actualPosition === undefined) {
          actualPosition = currentValue.length;
        } else if (actualPosition < 0) {
          actualPosition = 0;
        }

        const defaultDataStructure =
          action.type === 'ADD_COMPONENT_TO_DYNAMIC_ZONE'
            ? {
                ...state.componentsDataStructure[componentLayoutData.uid],
                __component: componentLayoutData.uid,
                __temp_key__: getMaxTempKey(currentValue) + 1,
              }
            : {
                ...state.componentsDataStructure[componentLayoutData.uid],
                __temp_key__: getMaxTempKey(currentValue) + 1,
              };

        const findAllRelationsAndReplaceWithEmptyArray = findAllAndReplace(
          allComponents,
          (value) => value.type === 'relation',
          []
        );

        const componentDataStructure = findAllRelationsAndReplaceWithEmptyArray(
          defaultDataStructure,
          componentLayoutData.attributes
        );

        currentValue.splice(actualPosition, 0, componentDataStructure);

        set(draftState, ['modifiedData', ...keys], currentValue);

        break;
      }
      case 'LOAD_RELATION': {
        const { initialDataPath, modifiedDataPath, value } = action;

        const initialDataRelations = (get(state, initialDataPath) ?? []) as RelationData[];
        const modifiedDataRelations = get(state, modifiedDataPath);

        const valuesToLoad = value.filter((relation) => {
          return !initialDataRelations.some((initialDataRelation) => {
            return initialDataRelation.id === relation.id;
          });
        });

        const keys = generateNKeysBetween(
          null,
          modifiedDataRelations[0]?.__temp_key__,
          valuesToLoad.length
        );

        /**
         * Check if the values we're loading are already in initial
         * data if they are then we don't need to load them at all
         */

        const valuesWithKeys = valuesToLoad.map((relation, index) => ({
          ...relation,
          __temp_key__: keys[index],
        }));

        /**
         * We need to set the value also on modifiedData, because initialData
         * and modifiedData need to stay in sync, so that the CM can compare
         * both states, to render the dirty UI state
         */
        set(
          draftState,
          initialDataPath,
          uniqBy([...valuesWithKeys, ...initialDataRelations], 'id')
        );
        set(
          draftState,
          modifiedDataPath,
          uniqBy([...valuesWithKeys, ...modifiedDataRelations], 'id')
        );

        break;
      }
      case 'CONNECT_RELATION': {
        const path = ['modifiedData', ...action.keys];
        const { value, toOneRelation } = action;

        /**
         * If the field is a single relation field we don't want to append
         * we just want to replace the value.
         */
        if (toOneRelation) {
          set(draftState, path, [value]);
        } else {
          const modifiedDataRelations = get(state, path);
          const [key] = generateNKeysBetween(modifiedDataRelations.at(-1)?.__temp_key__, null, 1);

          const newRelations = [...modifiedDataRelations, { ...value, __temp_key__: key }];
          set(draftState, path, newRelations);
        }

        break;
      }
      case 'DISCONNECT_RELATION': {
        const path = ['modifiedData', ...action.keys];
        const { id } = action;
        const modifiedDataRelation = get(state, [...path]) as RelationData[];

        const newRelations = modifiedDataRelation.filter((rel) => rel.id !== id);

        set(draftState, path, newRelations);

        break;
      }
      case 'MOVE_COMPONENT_FIELD':
      case 'REORDER_RELATION': {
        const { oldIndex, newIndex, keys } = action;
        const path = ['modifiedData', ...keys];
        const modifiedDataRelations = get(state, [...path]);

        const currentItem = modifiedDataRelations[oldIndex];

        const newRelations = [...modifiedDataRelations];

        if (action.type === 'REORDER_RELATION') {
          const startKey =
            oldIndex > newIndex
              ? modifiedDataRelations[newIndex - 1]?.__temp_key__
              : modifiedDataRelations[newIndex]?.__temp_key__;
          const endKey =
            oldIndex > newIndex
              ? modifiedDataRelations[newIndex]?.__temp_key__
              : modifiedDataRelations[newIndex + 1]?.__temp_key__;
          const [newKey] = generateNKeysBetween(startKey, endKey, 1);

          newRelations.splice(oldIndex, 1);
          newRelations.splice(newIndex, 0, { ...currentItem, __temp_key__: newKey });
        } else {
          newRelations.splice(oldIndex, 1);
          newRelations.splice(newIndex, 0, currentItem);
        }

        set(draftState, path, newRelations);

        break;
      }
      /**
       * This action will be called when you open your entry (first load)
       * but also every time you press publish.
       */
      case 'INIT_FORM': {
        const { initialValues, components = {}, attributes = {}, setModifiedDataOnly } = action;

        /**
         * You can't mutate an actions value.
         * and spreading an object only clones
         * the first level, the deeply nested values
         * are a reference.
         */
        const data = cloneDeep(initialValues);

        const findAllRelationsAndReplaceWithEmptyArray = findAllAndReplace(
          components,
          (value, { path }) => {
            const fieldName = path[path.length - 1];
            // We don't replace creator fields because we already return them without need to populate them separately
            const isCreatorField = CREATOR_FIELDS.includes(fieldName);

            return value.type === 'relation' && !isCreatorField;
          },
          (_, { path }) => {
            if (state.modifiedData?.id === data.id && get(state.modifiedData, path)) {
              return get(state.modifiedData, path);
            }

            return [];
          }
        );

        const mergedDataWithPreparedRelations = findAllRelationsAndReplaceWithEmptyArray(
          data,
          attributes
        );

        const findComponentsAndReplaceWithTempKey = findAllAndReplace(
          components,
          (value) =>
            value.type === 'dynamiczone' || (value.type === 'component' && !value.repeatable),
          (data) => {
            /**
             * If the data is an array, we have the dynamic zone if it's not, its a regular component.
             */
            return Array.isArray(data)
              ? data.map((datum, index) => ({
                  ...datum,
                  __temp_key__: index,
                }))
              : {
                  ...data,
                  __temp_key__: 0,
                };
          }
        );

        const mergedDataWithTmpKeys = findComponentsAndReplaceWithTempKey(
          mergedDataWithPreparedRelations,
          attributes,
          { ignoreFalseyValues: true }
        );

        if (!setModifiedDataOnly) {
          draftState.initialData = mergedDataWithTmpKeys;
        }

        draftState.modifiedData = mergedDataWithTmpKeys;

        draftState.formErrors = {};

        draftState.modifiedDZName = null;
        draftState.shouldCheckErrors = false;
        break;
      }
      case 'MOVE_COMPONENT_UP':
      case 'MOVE_COMPONENT_DOWN': {
        const { currentIndex, dynamicZoneName, shouldCheckErrors } = action;

        if (shouldCheckErrors) {
          draftState.shouldCheckErrors = !state.shouldCheckErrors;
        }

        const currentValue = state.modifiedData[dynamicZoneName];
        const nextIndex = action.type === 'MOVE_COMPONENT_UP' ? currentIndex - 1 : currentIndex + 1;
        const valueToInsert = state.modifiedData[dynamicZoneName][currentIndex];
        const updatedValue = moveFields(currentValue, currentIndex, nextIndex, valueToInsert);

        set(draftState, ['modifiedData', action.dynamicZoneName], updatedValue);

        break;
      }
      case 'MOVE_FIELD': {
        const currentValue = get(state, ['modifiedData', ...action.keys], []).slice();
        const valueToInsert = get(state, ['modifiedData', ...action.keys, action.dragIndex]);
        const updatedValue = moveFields(
          currentValue,
          action.dragIndex,
          action.overIndex,
          valueToInsert
        );

        set(draftState, ['modifiedData', ...action.keys], updatedValue);

        break;
      }
      case 'ON_CHANGE': {
        const [nonRepeatableComponentKey] = action.keys;

        // This is used to set the initialData for inputs
        // that needs an asynchronous initial value like the UID field
        // This is just a temporary patch.
        // TODO: Refactor the default form creation (workflow) to accept async default values.
        if (action.shouldSetInitialValue) {
          set(draftState, ['initialData', ...action.keys], action.value);
        }

        // FIXME: not sure this is needed...
        if (
          action.keys.length === 2 &&
          get(state, ['modifiedData', nonRepeatableComponentKey]) === null
        ) {
          set(draftState, ['modifiedData', nonRepeatableComponentKey], {
            [action.keys[1]]: action.value,
          });

          break;
        }

        set(draftState, ['modifiedData', ...action.keys], action.value);

        break;
      }
      case 'REMOVE_COMPONENT_FROM_DYNAMIC_ZONE': {
        if (action.shouldCheckErrors) {
          draftState.shouldCheckErrors = !state.shouldCheckErrors;
        }

        draftState.modifiedData[action.dynamicZoneName].splice(action.index, 1);

        break;
      }
      case 'REMOVE_COMPONENT_FROM_FIELD': {
        const componentPathToRemove = ['modifiedData', ...action.keys];

        set(draftState, componentPathToRemove, null);

        break;
      }
      case 'REMOVE_PASSWORD_FIELD': {
        unset(draftState, ['modifiedData', ...action.keys]);

        break;
      }
      case 'REMOVE_REPEATABLE_FIELD': {
        const keysLength = action.keys.length - 1;
        const pathToComponentData = ['modifiedData', ...take(action.keys, keysLength)];
        const hasErrors = Object.keys(state.formErrors).length > 0;

        if (hasErrors) {
          draftState.shouldCheckErrors = !state.shouldCheckErrors;
        }

        const currentValue = get(state, pathToComponentData).slice();
        currentValue.splice(parseInt(action.keys[keysLength], 10), 1);

        set(draftState, pathToComponentData, currentValue);

        break;
      }
      case 'SET_DEFAULT_DATA_STRUCTURES': {
        draftState.componentsDataStructure = action.componentsDataStructure;
        draftState.contentTypeDataStructure = action.contentTypeDataStructure;

        break;
      }
      case 'SET_FORM_ERRORS': {
        draftState.modifiedDZName = null;
        draftState.formErrors = action.errors;
        break;
      }
      case 'TRIGGER_FORM_VALIDATION': {
        const hasErrors = Object.keys(state.formErrors).length > 0;

        if (hasErrors) {
          draftState.shouldCheckErrors = !state.shouldCheckErrors;
        }

        break;
      }
      case 'SET_PUBLISH_CONFIRMATION': {
        draftState.publishConfirmation = { ...action.publishConfirmation };
        break;
      }
      case 'RESET_PUBLISH_CONFIRMATION': {
        draftState.publishConfirmation = { ...state.publishConfirmation, show: false };
        break;
      }
      default:
        return draftState;
    }
  });

export { reducer, initialState };
export type { EditViewDataManagerState };
