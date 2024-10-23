export default {
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  auth: {
    jwt: {
      audience: 'budget.hogent.be',
      issuer: 'budget.hogent.be',
      expirationInterval: 7 * 24 * 60 * 60, // s (7 days)
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};