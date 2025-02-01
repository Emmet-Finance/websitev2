
export const hrefIncludes = (path: string) => window.location.href.includes(path);

export const isExplorer = () => hrefIncludes("/explorer");

export const isLayer2View = () =>
    hrefIncludes("/your-liquidity")
    || hrefIncludes("/transactionDetails/")
    ;