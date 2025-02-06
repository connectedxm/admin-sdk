import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventActivation } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "./useGetEventActivations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches detailed information about a specific event activation using the admin API.
 * This function is designed to retrieve data related to a particular event activation by its unique identifiers.
 * It is useful for applications that need to display or process event activation details.
 * @name GetEventActivation
 * @param {string} eventId (path) - The id of the event
 * @param {string} activationId (path) - The id of the activation
 * @version 1.3
 **/

export const EVENT_ACTIVATION_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId), activationId];

export const SET_EVENT_ACTIVATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivation>>
) => {
  client.setQueryData(EVENT_ACTIVATION_QUERY_KEY(...keyParams), response);
};

interface GetEventActivationProps extends SingleQueryParams {
  eventId: string;
  activationId: string;
}

export const GetEventActivation = async ({
  eventId,
  activationId,
  adminApiParams,
}: GetEventActivationProps): Promise<ConnectedXMResponse<EventActivation>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}`
  );

  return data;
};

export const useGetEventActivation = (
  eventId: string,
  activationId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventActivation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivation>>(
    EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
    (params: SingleQueryParams) =>
      GetEventActivation({
        eventId,
        activationId: activationId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!activationId && (options?.enabled ?? true),
    },
    "events"
  );
};