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
    validRounges: [],
    myChattings: [],
    id: '',
    hasNewNotification: false,
  },
  status: 'standby',
  error: '',
};

export const getUser = createAsyncThunk('getUser', async (result: any) => {
  return await result;
});
// export const getUser = createAsyncThunk('getUser', async () => {
//   return await getMyInfo();
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
            myChattings: [],
            id: '',
            hasNewNotification: false,
          },
          status: 'standby',
          error: '',
        };
        if (action.payload.user.user.nickname) userState = action.payload.user;
        else userState = state.user;
        if (state.view.view.length === 0)
          return {
            ...action.payload,
            view:
              state.view.searchValue && action.payload.view.searchValue
                ? { view: [], searchValue: '' }
                : state.view,
            user: userState,
          };
        else
          return {
            user: userState,
            view:
              state.view.searchValue && action.payload.view.searchValue
                ? { view: [], searchValue: '' }
                : state.view,
            scroll: { scrollY: state.scroll.scrollY },
          };
      default:
        const combineReducer = combineReducers({
          user: userSlice.reducer,
          view: view.reducer,
          scroll: scroll.reducer,
        });
        return combineReducer(state, action);
    }
  }
};

export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;
