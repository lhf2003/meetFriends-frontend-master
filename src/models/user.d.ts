/**
 * 用户类别
 */
export type UserType = {
    id: number;
    userName: string;
    userAccount: string;
    userAvatar?: string;
    userProfile?: string;
    age?: number;
    gender: number;
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    tags: string;
    createTime: Date;
    address: string;
    distance?: number;
};
