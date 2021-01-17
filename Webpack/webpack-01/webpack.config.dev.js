const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: "./src/index.js",
    output:{
        filename:'main.js',
        path:path.resolve(__dirname,'./dist')
    },
    mode:'developemnt',
    module:{
        rules:[
            {
                test: /\.css$/,
                use:['style-loader','css-loader']

            }
        ]
    },
    pulgins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        })
    ]
}