import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMyInfo } from '@utils/function';
import { UserState, ViewPosts } from '@interface/StoreInterface';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { createStore } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
const initialUserState: UserState = {
  user: {
    nickname: '',
    jobSector: '',
    validRounges: [{ title: '토픽', url: 'topic' }],
    id: '',
    hasNewNotification: false,
    hasNewChatNotification: false,
    posts: [],
    email: '',
  },
  status: 'standby',
  error: '',
};

export const getUser = createAsyncThunk('getUser', async (result: any) => {
  return await result;
});
// export const getUser = createAsyncThunk('getUser', async (result: any) => {
//   return await getMyInfo(result);
// });
// console.log(getUser.name);
export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setNewUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setMyInfo: (state, action) => {
      state.user = action.payload;
    },
    reset: (state) => {
      Object.assign(state, initialUserState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = 'success';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.status = 'error';
      state.error = action.error.message;
    });
  },
});

const view = createSlice({
  name: 'view',
  initialState: { view: <any>[], searchValue: '' },
  reducers: {
    initialViewPosts(state, action) {
      state.view = [action.payload];
    },
    setViewPosts(state, action) {
      state.view = [...state.view, action.payload];
    },
    resetViewPosts(state) {
      state.view = [];
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
  },
});

const scroll = createSlice({
  name: 'scroll',
  initialState: { scrollY: 0 },
  reducers: {
    setScroll(state, action) {
      state.scrollY = action.payload;
    },
  },
});

// 임시
const topicPost = createSlice({
  name: 'posts',
  initialState: { posts: <any>[] },
  reducers: {
    setData(state, action) {
      console.log('setData 실행');
      state.posts = action.payload;
    },
  },
});

export const setDataAction = topicPost.actions.setData; // 임시

export const setViewAction = view.actions.setViewPosts;
export const resetViewAction = view.actions.resetViewPosts;
export const initialViewAction = view.actions.initialViewPosts;
export const setSearchValueAction = view.actions.setSearchValue;
export const setScrollAction = scroll.actions.setScroll;
export const setMyInfoAction = userSlice.actions.setMyInfo;
const rootReducer = (
  state: {
    user: UserState;
    view: ViewPosts;
    scroll: { scrollY: number };
    posts: any;
  },
  action: AnyAction,
) => {
  {
    switch (action.type) {
      case HYDRATE:
        // console.log(state);
        // return state;
        let userState: UserState = {
          user: {
            nickname: '',
            jobSector: '',
            validRounges: [],
            id: '',
            hasNewNotification: false,
            hasNewChatNotification: false,
            posts: [],
            email: '',
          },
          status: 'standby',
          error: '',
        };

        if (action.payload.user.user.nickname) userState = action.payload.user;
        else userState = state.user;
        if (state.view.view.length === 0) {
          return {
            ...action.payload,
            view:
              state.view.searchValue && action.payload.view.searchValue
                ? { view: [], searchValue: '' }
                : state.view,
            user: userState,
            posts: state.posts,
          };
        } else
          return {
            user: userState,
            view:
              state.view.searchValue && action.payload.view.searchValue
                ? { view: [], searchValue: '' }
                : state.view,
            scroll: { scrollY: state.scroll.scrollY },
            posts: state.posts,
          };
      default:
        const combineReducer = combineReducers({
          user: userSlice.reducer,
          view: view.reducer,
          scroll: scroll.reducer,
          posts: topicPost.reducer,
        });
        return combineReducer(state, action);
    }
  }
};

export const setNewUserInfo = userSlice.actions.setNewUserInfo;
export const reset = userSlice.actions.reset;
export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
