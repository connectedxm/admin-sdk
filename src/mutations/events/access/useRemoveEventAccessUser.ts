import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMMutationOptions } from "@src/mutations/useConnectedMutation";
import { EVENT_ACCESS_USERS_QUERY_KEY } from "@src/queries/events/access/GetEventAccessUsers";

/**
 * Endpoint to remove a user from the access list of a specific event.
 * This function allows administrators to revoke access for a user from a particular event,
 * ensuring that the user can no longer participate or view the event details.
 * It is useful in scenarios where user access needs to be dynamically managed.
 * @name RemoveEventAccessUser
 * @param {string} eventId (path) The id of the event
 * @param {string} userId (path) The id of the user
 * @version 1.3
 **/

interface RemoveEventAccessUserParams extends MutationParams {
  eventId: string;
  userId: string;
}

export const RemoveEventAccessUser = async ({
  eventId,
  userId,
  queryClient,
  adminApiParams,
}: RemoveEventAccessUserParams): Promise<ConnectedXMResponse<any>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/events/${eventId}/access-users/${userId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ACCESS_USERS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useRemoveEventAccessUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventAccessUser>>,
      Omit<RemoveEventAccessUserParams, "adminApiParams" | "queryClient">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventAccessUserParams,
    Awaited<ReturnType<typeof RemoveEventAccessUser>>
  >(RemoveEventAccessUser, options, {
    domain: "events",
    type: "update",
  });
};
