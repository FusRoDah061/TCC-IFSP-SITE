module.exports = {
    devServer: {
        host:'tcc.site'
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/TCC-IFSP-SITE'
    : '/'
}