class DeclinePermission extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeclinePermission';
    this.statusCode = 403;
  }
}

module.exports = {
  DeclinePermission,
};
