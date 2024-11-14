import { useConnectedXM } from "@src/hooks";
import {
  ModulePermissions,
  PermissionDomain,
  PermissionType,
} from "@src/interfaces";

const usePermission = (
  domain?: PermissionDomain | PermissionDomain[],
  type?: PermissionType | PermissionType[]
): { allowed: boolean } => {
  const { permissions } = useConnectedXM();

  let allowed = true;

  if (domain && type && !!permissions && !allowed) {
    if (Array.isArray(domain)) {
      if (Array.isArray(type)) {
        allowed = domain.every((d, i) =>
          checkAllowed(permissions?.[d], type[i]!)
        );
      } else {
        allowed = domain.every((d) => checkAllowed(permissions?.[d], type));
      }
    } else {
      if (Array.isArray(type)) {
        allowed = type.every((t) => checkAllowed(permissions?.[domain], t));
      } else {
        allowed = checkAllowed(permissions?.[domain], type);
      }
    }
  }

  return { allowed };
};

export default usePermission;

const checkAllowed = (permissions: ModulePermissions, type: PermissionType) => {
  return permissions[type] === true;
};
