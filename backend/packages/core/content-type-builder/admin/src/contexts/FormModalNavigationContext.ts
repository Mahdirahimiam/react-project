/* eslint-disable check-file/filename-naming-convention */
import * as React from 'react';

import { INITIAL_STATE_DATA } from '../components/FormModalNavigationProvider/constants';

import type {
  ModalEventProps,
  State,
} from '../components/FormModalNavigationProvider/FormModalNavigationProvider';
import type { SchemaType } from '../types';
import type { CustomFieldUID } from '@strapi/helper-plugin';
import type { UID } from '@strapi/types';

export interface FormModalNavigationContextValue {
  onCloseModal: () => void;
  onOpenModalAddField: (options: { forTarget: SchemaType; targetUid?: UID.Any }) => void;
  onClickSelectField: (option: ModalEventProps) => void;
  onClickSelectCustomField: (option: ModalEventProps) => void;
  onNavigateToChooseAttributeModal: (options: ModalEventProps) => void;
  onNavigateToAddCompoToDZModal: (options: ModalEventProps) => void;
  onOpenModalAddComponentsToDZ: (options: ModalEventProps) => void;
  onNavigateToCreateComponentStep2: () => void;
  onOpenModalCreateSchema: (options: State) => void;
  onOpenModalEditCategory: (categoryName: string) => void;
  onOpenModalEditField: (options: ModalEventProps) => void;
  onOpenModalEditCustomField: (options: ModalEventProps) => void;
  onOpenModalEditSchema: (options: ModalEventProps) => void;
  setFormModalNavigationState: (value: React.SetStateAction<typeof INITIAL_STATE_DATA>) => void;
  actionType: string;
  attributeName: string;
  attributeType: string;
  customFieldUid: CustomFieldUID;
  categoryName: string;
  dynamicZoneTarget: string;
  forTarget: SchemaType;
  modalType: string;
  isOpen: boolean;
  showBackLink: boolean;
  kind: string;
  step: string;
  targetUid: UID.Any;
}

// @ts-expect-error need to pass initial value to params
export const FormModalNavigationContext = React.createContext<FormModalNavigationContextValue>();
