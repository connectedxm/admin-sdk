import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupInvitation } from "@src/interfaces";
import { GROUP_INVITATIONS_QUERY_KEY } from "./useGetGroupInvitations";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches details of a specific group invitation using the group and invitation IDs.
 * This function is designed to retrieve detailed information about a group invitation,
 * which can be used in applications that manage or display group invitation data.
 * @name GetGroupInvitation
 * @param {string} groupId (path) The id of the group
 * @param {string} invitationId (path) The id of the invitation
 * @version 1.3
 **/

export const GROUP_INVITATION_QUERY_KEY = (
  groupId: string,
  invitationId: string
) => [...GROUP_INVITATIONS_QUERY_KEY(groupId), invitationId];

export const SET_GROUP_INVITATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_INVITATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupInvitation>>
) => {
  client.setQueryData(GROUP_INVITATION_QUERY_KEY(...keyParams), response);
};

interface GetGroupInvitationProps extends SingleQueryParams {
  groupId: string;
  invitationId: string;
}

export const GetGroupInvitation = async ({
  groupId,
  invitationId,
  adminApiParams,
}: GetGroupInvitationProps): Promise<ConnectedXMResponse<GroupInvitation>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/groups/${groupId}/invitations/${invitationId}`
  );
  return data;
};

export const useGetGroupInvitation = (
  groupId: string = "",
  invitationId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupInvitation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupInvitation>>(
    GROUP_INVITATION_QUERY_KEY(groupId, invitationId),
    (params: SingleQueryParams) =>
      GetGroupInvitation({ groupId, invitationId, ...params }),
    {
      ...options,
      enabled: !!groupId && !!invitationId && (options?.enabled ?? true),
    },
    "groups"
  );
};
