// See http://brunch.io for documentation.
exports.files = {
    javascripts: {
        joinTo: {
            'vendor.js': /\.js$/,
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
