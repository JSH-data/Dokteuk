import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMyInfo } from '@utils/function';
import { SearchResult, UserState, ViewPosts } from '@interface/StoreInterface';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { createStore } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { RoungePost, TopicPost } from '@interface/CardInterface';
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

export const setTempDataInitializing = createAsyncThunk(
  'setTempDataInitializing',
  async (result: any) => {
    return await result;
  },
);

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
      state.view.push(action.payload);
    },
    resetViewPosts(state) {
      state.view = [];
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    addViewPost(state, action) {
      state.view.unshift(action.payload);
    },
    likeViewPost(
      state,
      action: { payload: { postId: string; userId: string } },
    ) {
      outer: for (let i = 0; i < state.view.length; i++) {
        for (let j = 0; j < state.view[i].result.length; j++) {
          if (state.view[i].result[j].postId === action.payload.postId) {
            state.view[i].result[j].pressPerson.push(action.payload.userId);
            state.view[i].result[j].likeCount++;
            break outer;
          }
        }
      }
    },
    unLikeViewPost(
      state,
      action: { payload: { postId: string; userId: string } },
    ) {
      outer: for (let i = 0; i < state.view.length; i++) {
        // 이중반복분 탈출을 위한 플래그
        for (let j = 0; j < state.view[i].result.length; j++) {
          if (state.view[i].result[j].postId === action.payload.postId) {
            state.view[i].result[j].pressPerson = state.view[i].result[
              j
            ].pressPerson.filter((id: string) => id !== action.payload.userId);
            state.view[i].result[j].likeCount--;
            break outer;
          }
        }
      }
    },
    updateOnePost(
      state,
      action: { payload: { postId: string; postData: TopicPost | RoungePost } },
    ) {
      outer: for (let i = 0; i < state.view.length; i++) {
        // 이중반복분 탈출을 위한 플래그
        for (let j = 0; j < state.view[i].result.length; j++) {
          if (state.view[i].result[j].postId === action.payload.postId) {
            state.view[i].result[j] = {
              ...state.view[i].result[j],
              ...action.payload.postData,
            };
            break outer;
          }
        }
      }
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
const tempData = createSlice({
  name: 'tempData',
  initialState: { tempData: { data: <any>[], key: '', status: '' } },
  reducers: {
    setData(state, action) {
      state.tempData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setTempDataInitializing.fulfilled, (state, action) => {
      state.tempData = action.payload;
    });
  },
});

export const setDataAction = tempData.actions.setData; // 임시

export const setViewAction = view.actions.setViewPosts;
export const resetViewAction = view.actions.resetViewPosts;
export const initialViewAction = view.actions.initialViewPosts;
export const setSearchValueAction = view.actions.setSearchValue;
export const setScrollAction = scroll.actions.setScroll;
export const setMyInfoAction = userSlice.actions.setMyInfo;
export const likeViewPostAction = view.actions.likeViewPost;
export const unLikeViewPostAction = view.actions.unLikeViewPost;
export const updateOnePostAction = view.actions.updateOnePost;
const rootReducer = (
  state: {
    user: UserState;
    view: ViewPosts;
    scroll: { scrollY: number };
    tempData: any;
  },
  action: AnyAction,
) => {
  {
    switch (action.type) {
      case HYDRATE:
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
            tempData:
              action.payload.tempData.tempData.key != '' &&
              state.tempData.key == action.payload.tempData.tempData.key
                ? action.payload.tempData
                : state.tempData,
          };
        } else
          return {
            user: userState,
            view:
              state.view.searchValue && action.payload.view.searchValue
                ? { view: [], searchValue: '' }
                : state.view,
            scroll: { scrollY: state.scroll.scrollY },
            tempData:
              action.payload.tempData.tempData.key != '' &&
              state.tempData.key == action.payload.tempData.tempData.key
                ? action.payload.tempData
                : state.tempData,
          };
      default:
        const combineReducer = combineReducers({
          user: userSlice.reducer,
          view: view.reducer,
          scroll: scroll.reducer,
          tempData: tempData.reducer,
        });
        return combineReducer(state, action);
    }
  }
};

export const setNewUserInfo = userSlice.actions.setNewUserInfo;
export const reset = userSlice.actions.reset;
export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
