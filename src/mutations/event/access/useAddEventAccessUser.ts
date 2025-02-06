import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMMutationOptions } from "@src/mutations/useConnectedMutation";
import { EVENT_ACCESS_USERS_QUERY_KEY } from "@src/queries/events/access/GetEventAccessUsers";

/**
 * Endpoint to add a user to the access list of a specific event.
 * This function allows administrators to grant access to users for specific events by adding them to the event's access list.
 * It is designed to be used in applications where event access management is required.
 * @name AddEventAccessUser
 * @param {string} eventId (path) - The id of the event
 * @param {string} email (bodyValue) - The email of the user to be added
 * @version 1.3
 **/
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
 * @name Use Add Event Access User
 * @description Hook to use the AddEventAccessUser mutation
 **/
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
  >(AddEventAccessUser, options, {
    domain: "events",
    type: "update",
  });
};