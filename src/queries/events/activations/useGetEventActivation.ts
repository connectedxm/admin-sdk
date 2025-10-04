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
 * @category Keys
 * @group Events
 */
export const EVENT_ACTIVATION_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId), activationId];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
