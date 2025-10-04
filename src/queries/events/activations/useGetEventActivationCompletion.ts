import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, ActivationCompletion } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY } from "./useGetEventActivationCompletions";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACTIVATION_COMPLETION_QUERY_KEY = (
  eventId: string,
  activationId: string,
  completionId: string
) => [
  ...EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
  completionId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACTIVATION_COMPLETION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_COMPLETION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationCompletion>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_COMPLETION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationCompletionProps extends SingleQueryParams {
  eventId: string;
  activationId: string;
  completionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventActivationCompletion = async ({
  eventId,
  activationId,
  completionId,
  adminApiParams,
}: GetEventActivationCompletionProps): Promise<
  ConnectedXMResponse<ActivationCompletion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/completions/${completionId}`
  );

  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventActivationCompletion = (
  eventId: string,
  activationId: string,
  completionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventActivationCompletion>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventActivationCompletion>
  >(
    EVENT_ACTIVATION_COMPLETION_QUERY_KEY(eventId, activationId, completionId),
    (params: SingleQueryParams) =>
      GetEventActivationCompletion({
        eventId,
        activationId,
        completionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!activationId &&
        !!completionId &&
        (options?.enabled ?? true),
    }
  );
};
