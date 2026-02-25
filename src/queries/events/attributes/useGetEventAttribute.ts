import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAttribute } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ATTRIBUTES_QUERY_KEY } from "./useGetEventAttributes";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ATTRIBUTE_QUERY_KEY = (
  eventId: string,
  attributeId: string
) => [...EVENT_ATTRIBUTES_QUERY_KEY(eventId), attributeId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ATTRIBUTE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTRIBUTE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttribute>>
) => {
  client.setQueryData(EVENT_ATTRIBUTE_QUERY_KEY(...keyParams), response);
};

interface GetEventAttributeProps extends SingleQueryParams {
  eventId: string;
  attributeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAttribute = async ({
  eventId,
  attributeId,
  adminApiParams,
}: GetEventAttributeProps): Promise<
  ConnectedXMResponse<EventAttribute>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/attributes/${attributeId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAttribute = (
  eventId: string = "",
  attributeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAttribute>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAttribute>>(
    EVENT_ATTRIBUTE_QUERY_KEY(eventId, attributeId),
    (params: SingleQueryParams) =>
      GetEventAttribute({ eventId, attributeId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!attributeId && (options?.enabled ?? true),
    }
  );
};
