// import { GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
// import { createReducer } from 'deox';
// import { GenericStateSlice } from 'src/redux/types';
// import { setGuestUserAction, setUserAction, unsetUserAction, updateUserAction } from './actions';

// export type AuthenticationStateNone = {
//   authenticationType: 'none';
// };

// export type AuthenticationStateGuest = {
//   authenticationType: 'guest';
//   user: GuestUserRecord;
// };

// export type AuthenticationStateUser = {
//   authenticationType: 'user';
//   user: RegisteredUserRecord;

//   // TODO: @remove as it's not needed anymore here!
//   accessToken: string;
// };

// export type AuthenticationState =
//   | AuthenticationStateNone
//   | AuthenticationStateGuest
//   | AuthenticationStateUser;

// const initialState: AuthenticationState = {
//   authenticationType: 'none',
// };

// const reducer = createReducer(
//   initialState as AuthenticationState,
//   (handleAction) => [
//     handleAction(setUserAction, (_, { payload }) => {
//       return {
//         authenticationType: 'user',
//         user: payload.user,
//         accessToken: payload.accessToken,
//       };
//     }),
//     handleAction(updateUserAction, (state, { payload }) => {
//       if (state.authenticationType !== 'user') {
//         return state;
//       }

//       return {
//         ...state,
//         user: payload.user,
//       };
//     }),
//     handleAction(setGuestUserAction, (_, { payload }) => {
//       return {
//         authenticationType: 'guest',
//         user: payload,
//       };
//     }),
//     handleAction(unsetUserAction, () => ({
//       authenticationType: 'none',
//     })),
//   ]
// );

// export const stateSliceByKey = {
//   authentication: reducer,
// };

// export type ModuleState = ReturnType<typeof reducer>;
// export type ModuleStateSlice = GenericStateSlice<
//   typeof stateSliceByKey,
//   typeof reducer
// >;
