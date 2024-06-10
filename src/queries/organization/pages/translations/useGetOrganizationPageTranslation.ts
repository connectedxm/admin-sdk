import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { PageTranslation, PageType } from "@src/interfaces";
import { ORGANIZATION_PAGE_QUERY_KEY } from "../useGetOrganizationPage";

export const ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY = (
  type: PageType,
  locale: string
) => [...ORGANIZATION_PAGE_QUERY_KEY(type), locale];

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

interface GetOrganizationPageTranslationProps {
  type: PageType;
  locale: string;
}

export const GetOrganizationPageTranslation = async ({
  type,
  locale,
}: GetOrganizationPageTranslationProps): Promise<
  ConnectedXMResponse<PageTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/pages/${type}/translations/${locale}`
  );
  return data;
};

const useGetOrganizationPageTranslation = (type: PageType, locale: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationPageTranslation>>((
    ORGANIZATION_PAGE_TRANSLATION_QUERY_KEY(type, locale),
    () =>
      GetOrganizationPageTranslation({
        type,
        locale,
      }),
    {
      enabled: !!type && !!locale,
    }
  );
};

export default useGetOrganizationPageTranslation;
