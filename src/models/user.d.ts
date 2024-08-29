/**
 * 用户类别
 */
export type UserType = {
    id: number;
    userName: string;
    userAccount: string;
    userAvatar?: string;
    userProfile?: string;
    gender: number;
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    planetCode: string;
    tags: string;
    createTime: Date;
};
