import type { Attribute, Common } from '..';

export interface UIDOptions {
  separator?: string;
  lowercase?: boolean;
  decamelize?: boolean;
  customReplacements?: Array<[string, string]>;
  preserveLeadingUnderscore?: boolean;
}

export interface UIDProperties<
  TTargetAttribute extends string = string,
  TOptions extends UIDOptions = UIDOptions
> {
  targetField?: TTargetAttribute;
  options?: UIDOptions & TOptions;
}

export type UID<
  // TODO: V5:
  // The TOrigin was used to narrow down the list of possible target attribute for a
  // UID, but was removed due to circular dependency issues and will be removed in V5
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TOrigin extends Common.UID.Schema = never,
  TTargetAttribute extends string = string,
  TOptions extends UIDOptions = UIDOptions
> = Attribute.OfType<'uid'> &
  // Properties
  UIDProperties<TTargetAttribute, TOptions> &
  // Options
  Attribute.ConfigurableOption &
  Attribute.DefaultOption<UIDValue> &
  Attribute.MinMaxLengthOption &
  Attribute.PrivateOption &
  Attribute.RequiredOption &
  Attribute.WritableOption &
  Attribute.VisibleOption;

export type UIDValue = string;

export type GetUIDValue<TAttribute extends Attribute.Attribute> = TAttribute extends UID
  ? UIDValue
  : never;
