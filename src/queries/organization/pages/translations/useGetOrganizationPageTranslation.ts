import { ConnectedXMResponse } from "@src/interfaces";
import { PageTranslation, PageType } from "@src/interfaces";
import { ORGANIZATION_PAGE_QUERY_KEY } from "../useGetOrganizationPage";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY = (
  type: PageType,
  locale: string
) => [...ORGANIZATION_PAGE_QUERY_KEY(type), locale];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_PAGE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPageTranslation>>
) => {
  client.setQueryData(
    ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPageTranslationProps extends SingleQueryParams {
  type: PageType;
  locale: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationPageTranslation = async ({
  type,
  locale,
  adminApiParams,
}: GetOrganizationPageTranslationProps): Promise<
  ConnectedXMResponse<PageTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/pages/${type}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationPageTranslation = (
  type: PageType,
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPageTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPageTranslation>
  >(
    ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY(type, locale),
    (params: SingleQueryParams) =>
      GetOrganizationPageTranslation({
        type,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!type && !!locale && locale !== "en" && (options.enabled ?? true),
    },
    "org"
  );
};
