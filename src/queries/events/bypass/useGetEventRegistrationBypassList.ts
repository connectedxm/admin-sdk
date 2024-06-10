import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventRegistrationBypass } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENTS_QUERY_KEY } from "../useGetEvents";

export const EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(eventId),
  "BYPASS_LIST",
];

interface GetEventRegistrationBypassListProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventRegistrationBypassList = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventRegistrationBypassListProps): Promise<
  ConnectedXMResponse<EventRegistrationBypass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/bypass`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventRegistrationBypassList = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationBypassList>>
  >(
    EVENT_REGISTRATION_BYPASS_LIST_QUERY_KEY(eventId),
    (params: any) => GetEventRegistrationBypassList(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventRegistrationBypassList;
