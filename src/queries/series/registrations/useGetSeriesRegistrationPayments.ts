import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATION_PAYMENTS_QUERY_KEY = (
  seriesId: string,
  registrationId: string
) => [...SERIES_REGISTRATION_QUERY_KEY(seriesId, registrationId), "PAYMENTS"];

interface GetSeriesRegistrationPaymentsProps extends InfiniteQueryParams {
  seriesId: string;
  registrationId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistrationPayments = async ({
  seriesId,
  registrationId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesRegistrationPaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/series/${seriesId}/registrations/${registrationId}/payments`,
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

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesRegistrationPayments = (
  seriesId: string = "",
  registrationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesRegistrationPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesRegistrationPayments>>
  >(
    SERIES_REGISTRATION_PAYMENTS_QUERY_KEY(seriesId, registrationId),
    (params: InfiniteQueryParams) =>
      GetSeriesRegistrationPayments({ seriesId, registrationId, ...params }),
    params,
    {
      ...options,
      enabled:
        !!seriesId && !!registrationId && (options?.enabled ?? true),
    }
  );
};
