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
interface AddEventAccessUserParams extends MutationParams {
  eventId: string;
  email: string;
}

export const AddEventAccessUser = async ({
  eventId,
  email,
  queryClient,
  adminApiParams,
}: AddEventAccessUserParams): Promise<ConnectedXMResponse<any>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(`/events/${eventId}/access-users`, {
    email,
  });

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
export const useAddEventAccessUser = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventAccessUser>>,
      Omit<AddEventAccessUserParams, "adminApiParams" | "queryClient">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventAccessUserParams,
    Awaited<ReturnType<typeof AddEventAccessUser>>
  >(AddEventAccessUser, options);
};
