export default {
  cors: {
    origins: ['https://frontend-budget-2425.onrender.com'],
  },
  auth: {

    jwt: {

      expirationInterval: 7 * 24 * 60 * 60, // s (7 days)

    },
  },
};