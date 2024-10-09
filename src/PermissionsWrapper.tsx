import React from "react";
import { OrganizationMembership } from "./interfaces";
import { useGetSelfOrgMembership } from "./queries";

const PermissionsWrapper = ({
  children,
  setPermissions,
  authenticated,
}: {
  children: React.ReactNode;
  setPermissions: (permissions?: OrganizationMembership) => void;
  authenticated: boolean;
}) => {
  const { data: membership } = useGetSelfOrgMembership({
    enabled: authenticated,
  });

  React.useEffect(() => {
    if (membership) {
      setPermissions(membership.data);
    } else {
      setPermissions();
    }
  }, [membership, setPermissions]);

  return children;
};

export default PermissionsWrapper;
