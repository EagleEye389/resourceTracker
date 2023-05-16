export const setSessionData = (key: string,data: any) => {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export const clearSessionData = (key: string) => {
    sessionStorage.removeItem(key);
}

export const getSessionData = (key: string) => {
    return sessionStorage.getItem(key);
}