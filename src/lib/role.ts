// 角色常量映射

import axios from "@/request/base.ts";
import type {AxiosResponse} from "axios";


export class RoleResponse {
  public roles:any
}

export async function fetchUserRoles(){
  const res: AxiosResponse<RoleResponse> = await axios.get('/api/auth/roles');
  return res.data.roles;
}

export const ROLE = {
  Root: 1,
  Admin: 2,
  User: 3,
  UnLogin: 4,
};

// 计算最高权限（ID 越小权限越高）
export function highestRoleId(roles){
  if (!roles) return ROLE.UnLogin;
  return Math.min(...roles.value.map(r => r.id));
}

export function hasAdminPermission(roles){
  return highestRoleId(roles) <= ROLE.Admin
}
export function hasRootPermission(roles){
  return highestRoleId(roles) <= ROLE.Admin
}

