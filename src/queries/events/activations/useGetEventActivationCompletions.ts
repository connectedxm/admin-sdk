import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventActivationCompletion } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ACTIVATION_QUERY_KEY } from "./useGetEventActivation";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY = (
  eventId: string,
  activationId: string
) => [...EVENT_ACTIVATION_QUERY_KEY(eventId, activationId), "COMPLETIONS"];

export const SET_EVENT_ACTIVATION_COMPLETIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivationCompletions>>
) => {
  client.setQueryData(
    EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventActivationCompletionsProps extends InfiniteQueryParams {
  eventId: string;
  activationId: string;
}

export const GetEventActivationCompletions = async ({
  eventId,
  activationId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventActivationCompletionsProps): Promise<
  ConnectedXMResponse<EventActivationCompletion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/activations/${activationId}/completions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetEventActivationCompletions = (
  eventId: string,
  activationId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationCompletions>>
  >(
    EVENT_ACTIVATION_COMPLETIONS_QUERY_KEY(eventId, activationId),
    (params: any) => GetEventActivationCompletions(params),
    {
      eventId,
      activationId,
    },
    {
      enabled: !!eventId && !!activationId,
    }
  );
};

export default useGetEventActivationCompletions;
