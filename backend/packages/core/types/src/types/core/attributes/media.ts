import type { Attribute } from '..';
import type { Utils } from '../..';

export type MediaTarget = 'plugin::upload.file';
export type MediaKind = 'images' | 'videos' | 'files' | 'audios';

export interface MediaProperties<
  TKind extends MediaKind | undefined = undefined,
  TMultiple extends Utils.Expression.BooleanValue = Utils.Expression.False
> {
  allowedTypes?: TKind | TKind[];
  multiple?: TMultiple;
}

export type Media<
  TKind extends MediaKind | undefined = undefined,
  TMultiple extends Utils.Expression.BooleanValue = Utils.Expression.False
> = Attribute.OfType<'media'> &
  // Properties
  MediaProperties<TKind, TMultiple> &
  // Options
  Attribute.ConfigurableOption &
  Attribute.RequiredOption &
  Attribute.PrivateOption &
  Attribute.WritableOption &
  Attribute.VisibleOption;

// TODO: Introduce a real type for the media values
export type MediaValue<TMultiple extends Utils.Expression.BooleanValue = Utils.Expression.False> =
  Utils.Expression.If<TMultiple, any[], any>;

export type GetMediaValue<TAttribute extends Attribute.Attribute> = TAttribute extends Media<
  // Unused as long as the media value is any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  infer _TKind,
  infer TMultiple
>
  ? MediaValue<TMultiple>
  : never;

export type GetMediaTarget<TAttribute extends Attribute.Attribute> = TAttribute extends Media
  ? MediaTarget
  : never;
