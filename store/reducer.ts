import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMyInfo } from '@utils/function';
//@ts-ignore
import { UserState } from '@interface';

const initialUserState: UserState = {
  user: {
    nickname: '',
    jobSector: '',
    validRounges: [],
    myChattings: [],
    hasNewNotification: false,
  },
  status: 'standby',
  error: '',
};
export const getUser = createAsyncThunk('getUser', async () => {
  return await getMyInfo();
});
// console.log(getUser.name);
export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = 'success';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      console.log(action);
      state.status = 'error';
    });
  },

  // {
  //   [getUser.pending as any]: (state: UserState, action: any) => {
  //     state.status = 'loading';
  //   },
  //   [getUser.fulfilled as any]: (state: UserState, action: any) => {
  //     console.log(action.payload);
  //     state.user = action.payload;
  //     state.status = 'success';
  //   },
  //   [getUser.rejected as any]: (state: UserState, action: any) => {
  //     state.status = 'error';
  //   },
  // },
});
// console.log(userSlice);
const rootReducer = (state: UserState, action: AnyAction) => {
  {
    switch (action.type) {
      case HYDRATE:
        return action.payload;
      default:
        const combineReducer = combineReducers({
          user: userSlice.reducer,
        });
        return combineReducer(state, action);
    }
  }
};

export default rootReducer;
