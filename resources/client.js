module.exports = function () {
    return [{
        method: 'GET',
        path: '/client',
        handler: function (request, reply) {
            reply.view('client');
        }
    }];
};
