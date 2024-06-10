import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { PageTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { PageType } from "@/context/mutations/organization/pages/useUpdateOrganizationPage";
import { ORGANIZATION_PAGE_QUERY_KEY } from "../useGetOrganizationPage";

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

const useGetOrganizationPageTranslations = (type: PageType) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationPageTranslations>>
  >(
    ORGANIZATION_PAGE_TRANSLATIONS_QUERY_KEY(type),
    (params: any) => GetOrganizationPageTranslations(params),
    {
      type,
    },
    {
      enabled: !!type,
    }
  );
};

export default useGetOrganizationPageTranslations;
