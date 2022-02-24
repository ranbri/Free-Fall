import { AppState } from "./appState";
import { AnyAction } from "redux";
import { ActionType } from "./actionType";
export function reducer(oldAppState: AppState | undefined, action: AnyAction): AppState {

    if (!oldAppState) {
        return new AppState();
    }

    const newAppState = { ...oldAppState };

    switch (action.type) {

        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;

        case ActionType.AddVacation:
            newAppState.vacations.unshift(action.payload);
            break;

        case ActionType.ClearAllVacations:
            newAppState.vacations = [];
            break;

        case ActionType.GetAllUsers:
            newAppState.users = action.payload;
            break;

        case ActionType.SetUser:
            newAppState.user = action.payload;
            break;
        case ActionType.isLogged:
            newAppState.isLogged = action.payload;
            break;

    }

    return newAppState;
}