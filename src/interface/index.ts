export interface projectCacheDateType {
  id: number
  nickName: string
  projectName: string
  thisTotalRmb?: number | undefined | null
  itemTotalRmb?: number | undefined | null
  thisHaveCashedRmb?: number | undefined | null
  itemHaveCashedRmb?: number | undefined | null
  auditLevelTotal?: number | undefined | null
  auditLevel?: number | undefined | null
  projectUnit?: string | undefined | null
  projectUnitId?: number | undefined | null
  authorizedUnits?: string | undefined | null
  authorizedUsers?: string | undefined | null
  createUserName?: string | undefined | null
  createUserID?: number | undefined | null
  createDate?: string | undefined | null
  modifyUserName?: string | undefined | null
  modifyUserID?: number | undefined | null
  modifyDate?: string | undefined | null
  delUserName?: string | undefined | null
  delUserId?: number | undefined | null
  delDate?: string | undefined | null
  isDeleted?: number | undefined | null
  desc?: string | undefined //| null
  level?: number | undefined | null
  level1?: number | undefined | null
  level2?: number | undefined | null
  level3?: number | undefined | null
  level4?: number | undefined | null
  level5?: number | undefined | null
  level6?: number | undefined | null
  level7?: number | undefined | null
}

export type userRole =
  | 'superSuperAdmin'
  | 'superAdmin'
  | 'admin'
  | 'unitSuperAdmin'
  | 'unitAdmin'
  | 'user'
