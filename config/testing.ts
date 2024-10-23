export default {
  log: {
    level: 'silly',
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
      expirationInterval: 60 * 60, // s (1 hour)
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};