export const MAX_PAGE_SIZE = 10

type Options = {
    defaultLimit?: number
    maxLimit?: number
}

export default function normalizePagination(
    page: unknown,
    limit: unknown,
    { defaultLimit = MAX_PAGE_SIZE, maxLimit = MAX_PAGE_SIZE }: Options = {}
) {
    const currentPage = Number(page) || 1
    const pageSize = Math.min(Number(limit) || defaultLimit, maxLimit)

    return {
        page: currentPage,
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
    }
}
