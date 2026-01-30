import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMMutationOptions } from "@src/mutations/useConnectedMutation";
import { EVENT_ACCESS_USERS_QUERY_KEY } from "@src/queries/events/access/GetEventAccessUsers";

/**
 * @category Mutations
 * @group Events
 */
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

/**
 * @category Hooks
 * @group Events
 */
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
  >(RemoveEventAccessUser, options);
};
