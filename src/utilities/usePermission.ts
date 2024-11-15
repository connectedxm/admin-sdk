import { useConnectedXM } from "@src/hooks";
import {
  ModulePermissions,
  PermissionDomain,
  PermissionType,
} from "@src/interfaces";

const usePermission = (
  domain?: PermissionDomain | PermissionDomain[],
  type?: PermissionType | PermissionType[]
): { allowed: boolean; enabled: boolean } => {
  const { permissions } = useConnectedXM();

  let allowed = true;
  let enabled = true;

  if (domain && type && !!permissions && !allowed) {
    if (Array.isArray(domain)) {
      if (Array.isArray(type)) {
        allowed = domain.every((d, i) =>
          checkAllowed(permissions?.[d], type[i]!)
        );
        enabled = domain.every((d, i) =>
          checkEnabled(permissions?.[d], type[i]!)
        );
      } else {
        allowed = domain.every((d) => checkAllowed(permissions?.[d], type));
        enabled = domain.every((d) => checkEnabled(permissions?.[d], type));
      }
    } else {
      if (Array.isArray(type)) {
        allowed = type.every((t) => checkAllowed(permissions?.[domain], t));
        enabled = type.every((t) => checkEnabled(permissions?.[domain], t));
      } else {
        allowed = checkAllowed(permissions?.[domain], type);
        enabled = checkEnabled(permissions?.[domain], type);
      }
    }
  }

  return { allowed, enabled };
};

export default usePermission;

const checkAllowed = (permissions: ModulePermissions, type: PermissionType) => {
  return checkEnabled(permissions, type) && permissions[type];
};

const checkEnabled = (permissions: ModulePermissions, type: PermissionType) => {
  let enabled = true;

  if (permissions && !permissions[type]) {
    enabled = permissions.enabled;
  }

  return enabled;
};
