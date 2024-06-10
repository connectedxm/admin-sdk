import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Export, RegistrationStatus } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../useConnectedInfiniteQuery";
import { EVENT_REGISTRATIONS_QUERY_KEY } from "./useGetEventRegistrations";

export const EVENT_REGISTRATION_EXPORTS_QUERY_KEY = (
  eventId: string,
  status?: RegistrationStatus
) => [...EVENT_REGISTRATIONS_QUERY_KEY(eventId, status), "EXPORTS"];

interface GetEventRegistrationExportsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventRegistrationExports = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventRegistrationExportsProps): Promise<
  ConnectedXMResponse<Export[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/exports`,
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

const useGetEventRegistrationExports = (eventId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationExports>>
  >(
    EVENT_REGISTRATION_EXPORTS_QUERY_KEY(eventId),
    (params: any) => GetEventRegistrationExports(params),
    {
      eventId,
    },
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventRegistrationExports;
