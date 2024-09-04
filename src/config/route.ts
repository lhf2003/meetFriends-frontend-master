// 定义一些路由
import Index from "../pages/Index.vue";
import Team from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserDetailsPage from "../pages/UserDetailsPage.vue";
import ChatPage from "../pages/ChatPage.vue";
import UserFansPage from "../pages/UserFansPage.vue";
import UserFollowersPage from "../pages/UserFollowersPage.vue";
import UserChatPage from "../pages/UserChatPage.vue";
import TeamMemberPage from "../pages/TeamMemberPage.vue";

const routes = [
    {path: '/', component: Index},
    {path: '/team', title: '找队伍', component: Team},
    {path: '/team/add', title: '创建队伍', component: TeamAddPage},
    {path: '/team/update', title: '更新队伍', component: TeamUpdatePage},
    {path: '/team/members', title: '队伍成员', component: TeamMemberPage},
    {path: '/user', title: '个人信息', component: UserPage},
    {path: '/search', title: '找伙伴', component: SearchPage},
    {path: '/user/list', title: '用户列表', component: SearchResultPage},
    {path: '/user/edit', title: '编辑信息', component: UserEditPage},
    {path: '/user/login', title: '登录', component: UserLoginPage},
    {path: '/user/update', title: '更新信息', component: UserUpdatePage},
    {path: '/user/team/join', title: '我加入的队伍', component: UserTeamJoinPage},
    {path: '/user/team/create', title: '我创建的队伍', component: UserTeamCreatePage},
    {
        path: '/user/details',
        title: '用户详情',
        component: UserDetailsPage,
        props: route => ({
            userDetails: route.query.userDetails ? JSON.parse(route.query.userDetails as string) : {}
        }),
    },
    {path: '/chat', title: '消息', component: ChatPage},
    {path: '/user/fans', title:'粉丝列表', component: UserFansPage},
    {path: '/user/followers', title:'关注列表', component: UserFollowersPage},
    {path: '/chat/private',title:'私聊', component: UserChatPage},
];

export default routes;
