export interface asset {
    resourceId : number,
    type: string,
    description?: string,
}

export interface AssetList {
    assetList?: asset[],
}