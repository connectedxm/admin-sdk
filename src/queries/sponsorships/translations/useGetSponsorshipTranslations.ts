import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SPONSORSHIP_QUERY_KEY } from "../useGetSponsorship";

/**
 * @category Keys
 * @group Sponsorships
 */
export const SPONSORSHIP_TRANSLATIONS_QUERY_KEY = (sponsorhipId: string) => [
  ...SPONSORSHIP_QUERY_KEY(sponsorhipId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Sponsorships
 */
export const SET_SPONSORSHIP_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof SPONSORSHIP_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsorshipTranslations>>
) => {
  client.setQueryData(
    SPONSORSHIP_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSponsorshipTranslationsProps extends InfiniteQueryParams {
  sponsorhipId: string;
}

/**
 * @category Queries
 * @group Sponsorships
 */
export const GetSponsorshipTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  sponsorhipId,
  adminApiParams,
}: GetSponsorshipTranslationsProps): Promise<
  ConnectedXMResponse<SponsorshipTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/sponsorships/${sponsorhipId}/translations`,
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
 * @group Sponsorships
 */
export const useGetSponsorshipTranslations = (
  sponsorhipId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSponsorshipTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSponsorshipTranslations>>
  >(
    SPONSORSHIP_TRANSLATIONS_QUERY_KEY(sponsorhipId),
    (params: InfiniteQueryParams) =>
      GetSponsorshipTranslations({
        ...params,
        sponsorhipId,
      }),
    params,
    {
      ...options,
      enabled: !!sponsorhipId && (options.enabled ?? true),
    }
  );
};
