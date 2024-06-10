import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { BenefitTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { BENEFIT_QUERY_KEY } from "../useGetBenefit";

export const BENEFIT_TRANSLATIONS_QUERY_KEY = (benefitId: string) => [
  ...BENEFIT_QUERY_KEY(benefitId),
  "TRANSLATIONS",
];

export const SET_BENEFIT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFIT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefitTranslations>>
) => {
  client.setQueryData(BENEFIT_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitTranslationsProps extends InfiniteQueryParams {
  benefitId: string;
}

export const GetBenefitTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  benefitId,
}: GetBenefitTranslationsProps): Promise<
  ConnectedXMResponse<BenefitTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits/${benefitId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetBenefitTranslations = (benefitId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBenefitTranslations>>
  >(
    BENEFIT_TRANSLATIONS_QUERY_KEY(benefitId),
    (params: any) => GetBenefitTranslations(params),
    {
      benefitId,
    },
    {
      enabled: !!benefitId,
    }
  );
};

export default useGetBenefitTranslations;
