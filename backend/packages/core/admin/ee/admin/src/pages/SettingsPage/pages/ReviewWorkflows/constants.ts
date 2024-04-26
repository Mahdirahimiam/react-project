import { lightTheme } from '@strapi/design-system';

export const REDUX_NAMESPACE = 'settings_review-workflows';

export const ACTION_RESET_WORKFLOW = `Settings/Review_Workflows/RESET_WORKFLOW`;
export const ACTION_SET_CONTENT_TYPES = `Settings/Review_Workflows/SET_CONTENT_TYPES`;
export const ACTION_SET_IS_LOADING = `Settings/Review_Workflows/SET_IS_LOADING`;
export const ACTION_SET_ROLES = `Settings/Review_Workflows/SET_ROLES`;
export const ACTION_SET_WORKFLOW = `Settings/Review_Workflows/SET_WORKFLOW`;
export const ACTION_SET_WORKFLOWS = `Settings/Review_Workflows/SET_WORKFLOWS`;
export const ACTION_DELETE_STAGE = `Settings/Review_Workflows/WORKFLOW_DELETE_STAGE`;
export const ACTION_ADD_STAGE = `Settings/Review_Workflows/WORKFLOW_ADD_STAGE`;
export const ACTION_CLONE_STAGE = `Settings/Review_Workflows/WORKFLOW_CLONE_STAGE`;
export const ACTION_UPDATE_STAGE = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGE`;
export const ACTION_UPDATE_STAGES = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGES`;
export const ACTION_UPDATE_STAGE_POSITION = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGE_POSITION`;
export const ACTION_UPDATE_WORKFLOW = `Settings/Review_Workflows/WORKFLOW_UPDATE`;

export const STAGE_COLORS: Record<string, string> = {
  primary600: 'Blue',
  primary200: 'Lilac',
  alternative600: 'Violet',
  alternative200: 'Lavender',
  success600: 'Green',
  success200: 'Pale Green',
  danger500: 'Cherry',
  danger200: 'Pink',
  warning600: 'Orange',
  warning200: 'Yellow',
  secondary600: 'Teal',
  secondary200: 'Baby Blue',
  neutral400: 'Gray',
  neutral0: 'White',
};

export const STAGE_COLOR_DEFAULT = lightTheme.colors.primary600;

export type DragDropTypes = 'stage';

export const DRAG_DROP_TYPES: Record<Uppercase<DragDropTypes>, DragDropTypes> = {
  STAGE: 'stage',
};

export const CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME = 'numberOfWorkflows';
export const CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME = 'stagesPerWorkflow';
