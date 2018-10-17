// See http://brunch.io for documentation.
exports.files = {
    javascripts: {
        joinTo: {
            'vendor.js': /^(?!js)/,
            'app.js': /^js/
        }
    },
    stylesheets: {
        joinTo: 'app.css'
    }
}

exports.npm = {
    aliases: {
        react: 'preact'
    }
}

exports.plugins = {
    babel: {
        presets: ['latest'],
        plugins: [['transform-react-jsx', {pragma: 'h'}]]
    }
}

exports.paths = {
    public: '../dist'
}
//
// exports.config ={
// paths:
//     public: '../dist'
// files:
//     javascripts:
//         joinTo: 'javascripts/app.js'
// stylesheets:
//     joinTo: 'stylesheets/app.css'
// templates:
//     joinTo: 'javascripts/app.js'
