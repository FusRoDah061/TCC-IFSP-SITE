module.exports = {
    devServer: {
        host:'localhost',
        compress: true,
        historyApiFallback: {
            disableDotRule: false,
            verbose: true
        }
    },
    publicPath: getPublicPath () 
}

function getPublicPath () {
    let publicPath = '/';

    if(process.env.NODE_ENV === 'production') {
        if (process.env.HOST == 'github') {
            console.log('Building for GitHub Pages...');
            publicPath = '/TCC-IFSP-SITE';
        }
        else {
            console.log('Building Heroku app...');
        }
    }

    console.log('webpack publicPath: ', publicPath);
    return publicPath;
}