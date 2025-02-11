import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PageType } from "@src/interfaces";
import { PageTranslation } from "@src/interfaces";
import { ORGANIZATION_PAGE_QUERY_KEY } from "../useGetOrganizationPage";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * Retrieves translations for a specific organization page type.
 * This function fetches translations associated with a given page type within an organization, 
 * allowing for dynamic content localization. It is useful for applications that need to display 
 * translated content based on the user's language preferences.
 * @name GetOrganizationPageTranslations
 * @param {PageType} type (path) The type of the page for which translations are being retrieved
 * @version 1.3
 */
export const ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY = (type: PageType) => [
  ...ORGANIZATION_PAGE_QUERY_KEY(type),
  "TRANSLATIONS",
];

export const SET_ORGANIZATION_PAGE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPageTranslations>>
) => {
  client.setQueryData(
    ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPageTranslationsProps extends InfiniteQueryParams {
  type: PageType;
}

export const GetOrganizationPageTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  adminApiParams,
}: GetOrganizationPageTranslationsProps): Promise<
  ConnectedXMResponse<PageTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/pages/${type}/translations`,
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

export const useGetOrganizationPageTranslations = (
  type: PageType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationPageTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationPageTranslations>>
  >(
    ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(type),
    (params: InfiniteQueryParams) =>
      GetOrganizationPageTranslations({
        type,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    },
    "org"
  );
};