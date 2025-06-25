export const ROUTES = {
    AUTH: {
        REGISTER: '/REGISTER',
        LOGIN: '/LOGIN',
    },
    COMPANY: {
        CREATE_COMPANY: '/CREATE_COMPANY',
        GET_ALL_COMPANIES: '/GET_ALL_COMPANIES',
        GET_COMPANY_BY_ID: '/GET_COMPANY_BY_ID',
        UPDATE_COMPANY: '/UPDATE_COMPANY',
        DELETE_COMPANY: '/DELETE_COMPANY',
        SEARCH_COMPANIES: '/SEARCH_COMPANIES',
    },
    USER: {
        CREATE_USER: '/CREATE_USER',
        GET_ALL_USERS: '/GET_ALL_USERS',
        GET_USER_BY_ID: '/GET_USER_BY_ID',
        UPDATE_USER: '/UPDATE_USER',
        DELETE_USER: '/DELETE_USER',
    },
}

export const BASE_ROUTE = {
    BASE_URL: "/SHADOWDB/API",
    VERSION_ONE: "/V1",
    BASE_ADMIN: "/ADMIN",
    BASE_AUTH: "/AUTH",
    BASE_COMPANY: "/COMPANY",
    BASE_USER: "/USER",
  }

export const ROUTES_V1 = {
    AUTH: '/auth',
}
