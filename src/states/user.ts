// states/user.ts
import { reactive } from 'vue';
import { UserType } from '../models/user';

const state = reactive({
    currentUser: null as UserType | null,
});

const setCurrentUserState = (user: UserType | null) => {
    state.currentUser = user;
};

const getCurrentUserState = (): UserType | null => {
    return state.currentUser;
};

export {
    setCurrentUserState,
    getCurrentUserState,
}
