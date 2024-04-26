import * as contentTypeUtils from '../../content-types';
import type { Visitor } from '../../traverse/factory';

const ACTIONS_TO_VERIFY = ['find'];
const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypeUtils.constants;

type MorphArray = Array<{ __type: string }>;

export default (auth: unknown): Visitor =>
  async ({ data, key, attribute, schema }, { remove, set }) => {
    if (!attribute) {
      return;
    }

    const isRelation = attribute.type === 'relation';

    if (!isRelation) {
      return;
    }

    const handleMorphRelation = async () => {
      const newMorphValue: Record<string, unknown>[] = [];

      for (const element of (data as Record<string, MorphArray>)[key]) {
        const scopes = ACTIONS_TO_VERIFY.map((action) => `${element.__type}.${action}`);
        const isAllowed = await hasAccessToSomeScopes(scopes, auth);

        if (isAllowed) {
          newMorphValue.push(element);
        }
      }

      // If the new value is empty, remove the relation completely
      if (newMorphValue.length === 0) {
        remove(key);
      } else {
        set(key, newMorphValue);
      }
    };

    const handleRegularRelation = async () => {
      const scopes = ACTIONS_TO_VERIFY.map((action) => `${attribute.target}.${action}`);

      const isAllowed = await hasAccessToSomeScopes(scopes, auth);

      // If the authenticated user don't have access to any of the scopes, then remove the field
      if (!isAllowed) {
        remove(key);
      }
    };

    const isCreatorRelation = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(key);

    // Polymorphic relations
    if (contentTypeUtils.isMorphToRelationalAttribute(attribute)) {
      await handleMorphRelation();
      return;
    }

    // Creator relations
    if (isCreatorRelation && schema.options?.populateCreatorFields) {
      // do nothing
      return;
    }

    // Regular relations
    await handleRegularRelation();
  };

const hasAccessToSomeScopes = async (scopes: string[], auth: unknown) => {
  for (const scope of scopes) {
    try {
      await strapi.auth.verify(auth, { scope });
      return true;
    } catch {
      continue;
    }
  }

  return false;
};
